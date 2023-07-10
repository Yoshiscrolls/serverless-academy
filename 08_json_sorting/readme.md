# How to use the command line version injection tool

1. Terminal into this folder
2. Execute >>  sudo ruby main.rb  << to start the injection program.

# Minimum OS requirements & code compilation environment

- Minimum running macOS High Sierra 10.13
- Compile SDK macOS 14.0
- Target deployment platform macOS 10.13
- CMakeLists environment variables
- set(CMAKE_OSX_DEPLOYMENT_TARGET "10.13")

# App Compatibility

### M-series and Intel versions of the following apps are supported:

| App                                            | Version              | ARM64  | Intel 
| Parallels Desktop                              | 18.3.2               |   ✅   |   ✅ 
### Warning
Be sure to turn off SIP, as the injection method I use relies on turning off SIP.

