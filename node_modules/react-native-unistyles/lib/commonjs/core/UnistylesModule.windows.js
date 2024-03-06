"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnistylesModule = void 0;
var _reactNative = require("react-native");
// while debugging modules will default to NativeModules
// without debugging/in release mode module will be available in TurboModules
const UnistylesModule = exports.UnistylesModule = _reactNative.TurboModuleRegistry.getEnforcing('Unistyles') ?? _reactNative.NativeModules?.Unistyles;
//# sourceMappingURL=UnistylesModule.windows.js.map