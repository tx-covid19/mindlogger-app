# Hornsense 0.0.1

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system, or visit https://mindlogger.org for instructions to download the demo mobile app.

### Widget development

[See the widget development guide](https://github.com/tx-covid19/mindlogger-app/blob/master/widget-development.md)

### Prerequisites

You need [Node, npm](https://github.com/creationix/nvm#user-content-usage), [yarn](https://yarnpkg.com) and [React Native](https://facebook.github.io/react-native/) to be installed.
For example
```
npm -v
6.14.0
yarn -v
1.13.0
react-native -v
react-native: 0.61.5
```
You also need to have [Xcode](https://developer.apple.com/xcode/) and [Android Studio](https://developer.android.com/studio/) to be installed.

### Installing

You need to install packages first.

```
yarn install
```

Link packages with React Native iOS and Android projects

```
react-native link
```

## Development

iOS:
```
yarn ios
```

Android:
```
yarn android
```

### Testing

You can run unit tests locally.

```
yarn test
```

You can also run eslint on the entire codebase.

```
yarn lint
```

## Release build

### Bitrise

Continuous integration: changes to the master branch will be automatically built through [Bitrise](https://app.bitrise.io/app/68551a54551c4340).

### fastlane (iOS)

iOS:

You can use [fastlane](https://fastlane.tools/)
From root directory of repository
```
cd ios
fastlane beta
```
It will archive release build for iOS and push to appstore. It will take several minutes.

### Xcode (iOS)

Otherwise, you can build and archive manually using Xcode.

### yarn (Android)

Android:

```
yarn prod-bundle
yarn prod-build
```
It will create app-release.apk in android/app/build/outputs folder

## Built With

* [React Native](https://facebook.github.io/react-native/docs/getting-started.html) - React Native framework

## Contributing

See [:link: CONTRIBUTING](./CONTRIBUTING.md).

## Versioning

See [:link: CONTRIBUTING#Versioning](./CONTRIBUTING.md#Versioning).

## Authors

See the list of [contributors](https://github.com/tx-covid19/mindlogger-app/contributors) who participated in this project.

## License

[Apache 2.0](LICENSE)
