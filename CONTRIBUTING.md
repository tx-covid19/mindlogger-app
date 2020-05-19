# Contributing

1. Clone this repository.
2. Create a new, feature-specific branch to work in.
3. Ensure any code you modify complies with the linting rules set up in ```.eslintrc```
4. When you're ready to submit your changes, submit a pull request from your branch to the branch you branched from (ie, the branch you checked out, usually `master`).
5. One or more of the project developers will review your request and merge or request changes.

## Pull requests

Each pull request (PR) requires a review from at least one contributor other than the author of that PR.

### Submitting a PR
1. From your branch, open a pull request to [`master`](https://github.com/tx-covid19/mindlogger-app/tree/master).
2. Give your PR a descriptive title.
3. Give a brief but thorough description of what your PR does.
4. Submit. [Bitrise](https://app.bitrise.io/app/cd8e019aed55b142) will run :microscope: tests.
5. Wait for a review.
6. Respond to the review if necessary.

## Reviewing a PR
1. Review the description.
2. Test the branch and verify that the changes work as expected.
3. If any changes are necessary, request those changes.
4. Otherwise, or once the necessary changes are made, approve the PR.
5. Merge the PR (usually via a merge commit, but by a merge squash or a merge rebase by discretion).

## Versioning

Use [Semantic Versioning 2.0.0](https://semver.org/#semantic-versioning-200).

For this repository, the version exists in 4 places:
1. [README](./README.md)
2. [package.json](https://github.com/tx-covid19/mindlogger-app/blob/master/package.json): [`version`](https://github.com/tx-covid19/mindlogger-app/blob/master/package.json#L3)
3. [mindlogger-app/android/app/build.gradle](https://github.com/tx-covid19/mindlogger-app/blob/e0903c84ca6ad94b0b942bd8aaa79c3d31ba04a6/android/app/build.gradle)
   1. [`versionName`](https://github.com/tx-covid19/mindlogger-app/blob/e0903c84ca6ad94b0b942bd8aaa79c3d31ba04a6/android/app/build.gradle#L105)
   2. [`versionCode`](https://github.com/tx-covid19/mindlogger-app/blob/e0903c84ca6ad94b0b942bd8aaa79c3d31ba04a6/android/app/build.gradle#L104) (integer: increment from previous build regardless of the rest of the version numbering)
4. [ios/MDCApp/Info.plist](https://github.com/tx-covid19/mindlogger-app/blob/master/ios/MDCApp/Info.plist)
   1. [`CFBundleShortVersionString`](https://github.com/tx-covid19/mindlogger-app/blob/26bb15b5836aae44df2cde04bf93a018cccfff04/ios/MDCApp/Info.plist#L19-L20)
   2. [`CFBundleVersion`](https://github.com/tx-covid19/mindlogger-app/blob/26bb15b5836aae44df2cde04bf93a018cccfff04/ios/MDCApp/Info.plist#L23-L24) (match to [`versionCode`, above](#versioncode))
