# Quickstart

## WSL2

For development on WSL2, follow these instructions: [https://github.com/expo/fyi/blob/main/wsl.md](https://github.com/expo/fyi/blob/main/wsl.md)

## Dependencies

Install dependencies

```bash
npm install
```

## Backend

Follow the setup instructions in `backend/README.md`

## Docs

Generate the types from OpenAPI schema

```bash
chmod +x get_docs
./bin/get_docs
```

## Development

Run the appropriate start script

```bash
npm run start

#web
npm run web
```

## Adding a screen

There are four stacks: AuthStack, HomeStack, CommunityStack, and ProfileStack.

To add a screen, edit `NavigationParams.tsx` and add the key under the appropriate stack.
This allows for TypeScript to recognize the name when using the navigation tools.

Add the screen component in `Navigators.tsx`.

To navigate within a stack, use the following snippet:

```typescript
import { AuthNavigation } from '../navigation/Navigators'; // Whichever stack the screen is in
...
const navigation = useNavigation<AuthNavigation>();
navigation.navigate('ScreenName');
```

To navigate across stacks, use the following snippet:

```typescript
import { RootNavigation } from "../navigation/RootNavigator";
...
const navigation = useNavigation<RootNavigation>();
navigation.navigate("StackName", { screen: "ScreenName" });
```
