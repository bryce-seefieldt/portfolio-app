#!/usr/bin/env bash

set -euo pipefail

DEFAULT_REPO="bryce-seefieldt/portfolio-app"

usage() {
  cat <<'EOF'
Usage: backport-pr-remediation.sh [options]

Options:
  -r, --repo <owner/name>       GitHub repo to operate on
  -t, --target-pr <number>      Older open PR to update
  -s, --source-pr <number>      Newer remediation PR to cherry-pick from
  -c, --sha <sha>               Non-merge commit SHA to cherry-pick (repeatable)
      --verify                  Run quick verification after cherry-pick
      --no-verify               Skip quick verification after cherry-pick
  -y, --yes                     Skip confirmation prompt
  -h, --help                    Show this help text

Notes:
  - If target/source PR flags are omitted, the script will try to use the oldest
    open PR as the target and the most recently closed PR as the source.
  - SHA values may be abbreviated to 7+ hex characters, but they must be regular
    commit SHAs from the source PR. Do not use merge commit SHAs.
EOF
}

prompt_with_default() {
  local prompt="$1"
  local default_value="$2"
  local response=""

  if [[ -n "${default_value}" ]]; then
    read -r -p "${prompt} [${default_value}]: " response
    printf '%s\n' "${response:-$default_value}"
  else
    read -r -p "${prompt}: " response
    printf '%s\n' "${response}"
  fi
}

resolve_oldest_open_pr() {
  gh pr list \
    --repo "$1" \
    --state open \
    --limit 100 \
    --json number,createdAt \
    --jq 'sort_by(.createdAt) | if length > 0 then .[0].number else empty end' \
    2>/dev/null || true
}

resolve_latest_closed_pr() {
  gh pr list \
    --repo "$1" \
    --state closed \
    --limit 100 \
    --json number,closedAt \
    --jq 'sort_by(.closedAt) | if length > 0 then .[-1].number else empty end' \
    2>/dev/null || true
}

resolve_latest_non_merge_sha() {
  gh pr view "$1" \
    --repo "$2" \
    --json commits \
    --jq '.commits
      | map(select(.messageHeadline | startswith("Merge ") | not))
      | if length > 0 then .[-1].oid else empty end' \
    2>/dev/null || true
}

resolve_non_merge_sha_hints() {
  gh pr view "$1" \
    --repo "$2" \
    --json commits \
    --jq '.commits
      | map(select(.messageHeadline | startswith("Merge ") | not))
      | map(.oid[0:7] + " " + .messageHeadline)
      | join("; ")' \
    2>/dev/null || true
}

validate_pr_number() {
  [[ "$1" =~ ^[0-9]+$ ]]
}

validate_sha_token() {
  [[ "$1" =~ ^[0-9a-fA-F]{7,40}$ ]]
}

REPO="$DEFAULT_REPO"
TARGET_PR=""
SOURCE_PR=""
RUN_VERIFY=""
AUTO_CONFIRM=0
declare -a SHA_VALUES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --)
      shift
      ;;
    -r|--repo)
      REPO="$2"
      shift 2
      ;;
    -t|--target-pr)
      TARGET_PR="$2"
      shift 2
      ;;
    -s|--source-pr)
      SOURCE_PR="$2"
      shift 2
      ;;
    -c|--sha)
      SHA_VALUES+=("$2")
      shift 2
      ;;
    --verify)
      RUN_VERIFY="y"
      shift
      ;;
    --no-verify)
      RUN_VERIFY="n"
      shift
      ;;
    -y|--yes)
      AUTO_CONFIRM=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown option '$1'." >&2
      usage >&2
      exit 1
      ;;
  esac
done

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

TARGET_DEFAULT="$(resolve_oldest_open_pr "${REPO}")"
SOURCE_DEFAULT="$(resolve_latest_closed_pr "${REPO}")"

if [[ -z "${TARGET_PR}" ]]; then
  TARGET_PR="$(prompt_with_default "Target older PR number" "${TARGET_DEFAULT}")"
fi

if [[ -z "${TARGET_PR}" ]]; then
  echo "Error: target PR number is required." >&2
  exit 1
fi

if ! validate_pr_number "${TARGET_PR}"; then
  echo "Error: target PR must be a numeric PR number." >&2
  exit 1
fi

if [[ -z "${SOURCE_PR}" ]]; then
  SOURCE_PR="$(prompt_with_default "Source remediation PR number" "${SOURCE_DEFAULT}")"
fi

if [[ -z "${SOURCE_PR}" ]]; then
  echo "Error: source PR number is required." >&2
  exit 1
fi

if ! validate_pr_number "${SOURCE_PR}"; then
  echo "Error: source PR must be a numeric PR number." >&2
  exit 1
fi

AUTO_SHA=""
SHA_HINTS=""

if [[ ${#SHA_VALUES[@]} -eq 0 ]]; then
  AUTO_SHA="$(resolve_latest_non_merge_sha "${SOURCE_PR}" "${REPO}")"
  SHA_HINTS="$(resolve_non_merge_sha_hints "${SOURCE_PR}" "${REPO}")"

  if [[ -n "${SHA_HINTS}" ]]; then
    echo "Source PR non-merge commit candidates: ${SHA_HINTS}"
  fi

  if [[ -n "${AUTO_SHA}" ]]; then
    SHA_INPUT="$(prompt_with_default "Cherry-pick commit SHA(s) for the source remediation commits (use non-merge commit SHA(s) from PR #${SOURCE_PR}; space-separated for multiple)" "${AUTO_SHA}")"
  else
    SHA_INPUT="$(prompt_with_default "Cherry-pick commit SHA(s) for the source remediation commits (use non-merge commit SHA(s) from PR #${SOURCE_PR}; space-separated for multiple)" "")"
  fi

  if [[ -n "${SHA_INPUT}" ]]; then
    read -r -a SHA_VALUES <<< "${SHA_INPUT}"
  fi
fi

if [[ ${#SHA_VALUES[@]} -eq 0 ]]; then
  echo "Error: at least one commit SHA is required." >&2
  exit 1
fi

for sha in "${SHA_VALUES[@]}"; do
  if ! validate_sha_token "${sha}"; then
    echo "Error: invalid SHA '${sha}'. Use 7-40 hex characters from non-merge source PR commits." >&2
    exit 1
  fi
done

if [[ -z "${RUN_VERIFY}" ]]; then
  read -r -p "Run quick verification after cherry-pick? [y/N]: " RUN_VERIFY
fi

echo
echo "Summary"
echo "- Repo: ${REPO}"
echo "- Target PR: #${TARGET_PR}"
echo "- Source PR: #${SOURCE_PR}"
echo "- SHA(s): ${SHA_VALUES[*]}"
echo

if [[ ${AUTO_CONFIRM} -eq 0 ]]; then
  read -r -p "Proceed with checkout, cherry-pick, and push? [y/N]: " CONFIRM
  if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
  fi
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
for sha in "${SHA_VALUES[@]}"; do
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