#!/usr/bin/env bash

set -euo pipefail

DEFAULT_REPO="bryce-seefieldt/portfolio-app"
DEFAULT_SOURCE_PR="116"

command -v gh >/dev/null 2>&1 || {
  echo "Error: gh CLI is required but not installed." >&2
  exit 1
}

command -v git >/dev/null 2>&1 || {
  echo "Error: git is required but not installed." >&2
  exit 1
}

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is not clean. Commit or stash changes first." >&2
  exit 1
fi

read -r -p "GitHub repo [${DEFAULT_REPO}]: " REPO
REPO="${REPO:-$DEFAULT_REPO}"

read -r -p "Target older PR number (required): " TARGET_PR
if [[ -z "${TARGET_PR}" ]]; then
  echo "Error: target PR number is required." >&2
  exit 1
fi

read -r -p "Source remediation PR number [${DEFAULT_SOURCE_PR}]: " SOURCE_PR
SOURCE_PR="${SOURCE_PR:-$DEFAULT_SOURCE_PR}"

AUTO_SHA=""
if ! AUTO_SHA="$(gh pr view "${SOURCE_PR}" --repo "${REPO}" --json commits --jq '.commits[-1].oid' 2>/dev/null)"; then
  echo "Warning: could not auto-resolve commit from PR #${SOURCE_PR}." >&2
fi

if [[ -n "${AUTO_SHA}" ]]; then
  read -r -p "Cherry-pick commit SHA(s) [${AUTO_SHA}] (space-separated for multiple): " SHA_INPUT
  SHA_INPUT="${SHA_INPUT:-$AUTO_SHA}"
else
  read -r -p "Cherry-pick commit SHA(s) (space-separated): " SHA_INPUT
fi

if [[ -z "${SHA_INPUT}" ]]; then
  echo "Error: at least one commit SHA is required." >&2
  exit 1
fi

read -r -p "Run quick verification after cherry-pick? [y/N]: " RUN_VERIFY

echo
echo "Summary"
echo "- Repo: ${REPO}"
echo "- Target PR: #${TARGET_PR}"
echo "- Source PR: #${SOURCE_PR}"
echo "- SHA(s): ${SHA_INPUT}"
echo

read -r -p "Proceed with checkout, cherry-pick, and push? [y/N]: " CONFIRM
if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Fetching target PR metadata..."
TARGET_STATE="$(gh pr view "${TARGET_PR}" --repo "${REPO}" --json state --jq .state)"
if [[ "${TARGET_STATE}" != "OPEN" ]]; then
  echo "Error: target PR #${TARGET_PR} is not OPEN (state=${TARGET_STATE})." >&2
  exit 1
fi

echo "Checking out PR #${TARGET_PR}..."
gh pr checkout "${TARGET_PR}" --repo "${REPO}"

echo "Cherry-picking remediation commit(s)..."
for sha in ${SHA_INPUT}; do
  echo "- applying ${sha}"
  if ! git cherry-pick "${sha}"; then
    echo "Cherry-pick failed for ${sha}. Resolve conflicts, then run:" >&2
    echo "  git cherry-pick --continue" >&2
    echo "or abort with:" >&2
    echo "  git cherry-pick --abort" >&2
    exit 1
  fi
done

if [[ "${RUN_VERIFY}" =~ ^[Yy]$ ]]; then
  if [[ -x "./scripts/verify-local.sh" ]]; then
    echo "Running quick verification (verify:quick)..."
    pnpm verify:quick
  else
    echo "Skipping verification: verify script not found." >&2
  fi
fi

echo "Pushing branch updates..."
if ! git push; then
  echo "Push failed. If branch protections or permissions block direct push," >&2
  echo "create a maintainer recovery branch and open a superseding PR." >&2
  exit 1
fi

echo "Refreshing PR checks..."
gh pr checks "${TARGET_PR}" --repo "${REPO}" || true

echo
echo "Done. PR #${TARGET_PR} was updated with remediation commit(s)."