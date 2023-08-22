This is a minimal-dependency HTML+CSS+Javascript project intended to be built into a single-file HTML webapp.

We're using Bulma as a CSS framework (@imported from jsdelivr CDN), `parcel` as a build tool, and `lit` for templating.
We mix and match JS and TS for pragmatic reasons (lit templates are TS, but the rest of the code is JS); Parcel handles this just fine out of the box.

After checking out, to run the project one can simply run `yarn start`.
To build the production version, run `yarn build`.