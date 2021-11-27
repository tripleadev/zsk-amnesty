#!/usr/bin/env bash

if [ "$VERCEL_GIT_COMMIT_REF" = "dev"  ] || [ "$VERCEL_GIT_COMMIT_REF" = "main" ]
then
  yarn prisma migrate deploy
fi
