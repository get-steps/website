#!/bin/bash

# Example Usage
# SENTRY_AUTH_TOKEN="<auth_token>"
# SENTRY_ORG="<sentry_oranisation>"
# SENTRY_PROJECT="<sentry_project>"
# bash deploybot.sh --debug

# Configuration
DEFAULT_COMPILE_ENVIRONMENT="production"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
RELEASE_NAME=$PACKAGE_NAME@$PACKAGE_VERSION

# Parse arguments
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
  --debug)
    COMPILE_ENVIRONMENT="development"
    shift
  ;;
  *)
    echo "Unknown argument: $key"
    shift
  ;;
esac
done

# Build
echo Building version ${RELEASE_NAME}...
nvm use 6.3.1
sass -v
node -v
grunt compile:${COMPILE_ENVIRONMENT:-$DEFAULT_COMPILE_ENVIRONMENT} --env=production

# Sentry
if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
  echo 'No Sentry auth token found' && exit 1
fi

if [ -z "${SENTRY_ORG:-}" ]; then
  echo 'No Sentry organisation found' && exit 1
fi

if [ -z "${SENTRY_PROJECT:-}" ]; then
  echo 'No Sentry project found' && exit 1
fi

if ! type 'sentry-cli' > /dev/null; then
  curl -sL https://sentry.io/get-cli/ | bash
fi

sentry-cli --version
sentry-cli releases new ${RELEASE_NAME}
sentry-cli releases files ${RELEASE_NAME} upload-sourcemaps ./shop/assets/
sentry-cli releases finalize ${RELEASE_NAME}
