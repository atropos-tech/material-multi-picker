We welcome contributions from developers, especially bugfixes, uplifts to dependencies, code quality, etc. New features are also welcome but please raise an issue first on GitHub to discuss whether it's right for the project. Feature requests should ideally be driven by an actual real-world use case, rather than "it would be cool if&hellip;".

# Setting up for development
 * Make sure you have the latest NodeJS/npm installed, and git
 * Clone the repository (`git clone https://github.com/atropos-tech/material-multi-picker.git`)
 * Install all dependencies (`npm install`)

## Demo/Sandbox
Do `npm start` to run a demo server on port 8080. This is probably the best way to test changes during initial development - if you're adding a new feature, please add a new example in the sandbox.

# Testing
The tests use Jest and enzmye. Overall we prefer testing the whole component rather than individual subcomponents, because (a) none of the individual subcomponents are doing anything particularly complex on their own, and (b) many of our features cut across multiple subcomponents, so behaviour testing against the whole component is more coherent that trying to test the individual subcomponents for their contribution to that behaviour.

To avoid having extremely long test files we break them down by feature category.

When developing, use `npm test` to run tests with watching.

## Snapshots
We use snapshots whereever possible to test correct rendering, but prefer not to rely solely on them - it's good to use other expectations too, in case it's not clear what the snapshot should be, or just to make the test intention clearer.

## Coverage
We try to keep coverage high, but 100% is not necessary. All features/bugfix should have associated tests, but writing tests just to get 100% coverage if it doesn't cover a meaningful case is discouraged.

