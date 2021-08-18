# Example App using Harness React Native SDK (ff-react-native-client-sdk) for Demo purposes

This Demo App will demonstrate the usage and capabilities of React Native client SDK.

### Setup

To install SDK, add a dependency to project's `package.json` file:

```
"@harnessio/ff-react-native-client-sdk": "0.0.2",
```

Then, you may import package to your project. The SDK is used via single instance exported from `index.d.ts` module

```Javascript
import cfClientInstance from '@harnessio/ff-react-native-client-sdk';
```


### Accounts used:
| No. | Account |
| ---- | ---------- |
| 1 | `Aptiv` |
| 2 | `Experian` |
| 3 | `Fiserv` |
| 4 | `Harness` |
| 5 | `Palo Alto Networks` |


During initialization, the target is one of the above accounts, selected from the list, on the first screen of the Demo App.

In order to change the account, you would need to go back to the initial screen and select a different account to use.
