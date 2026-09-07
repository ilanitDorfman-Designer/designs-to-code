# Figma Component Index

Master list of eToro design-system components in the "DS - React" Figma file (`cMyPhFndkPeXR6UkIuZujT`), imported from the components spreadsheet. This is the enumeration source for [component-tiers.md](component-tiers.md) — use it to find a component's Figma node before checking Code Connect status.

**Only this file/library is a valid source for Figma components.** File key `cMyPhFndkPeXR6UkIuZujT`, library key `lk-d2af2fc51554edff2f4e2f7ee7f4dc19ca61b38adf60d90eb0444ad9315a208bd58b1baa1e2be133aa90ab2733656bea224cd42315a7f33fc19ea4775b6068fa` ("DS - React"). Any working Figma file typically has other, unrelated libraries enabled alongside this one (e.g. "eToros Design System (Desktop only)," marketing/legacy/community kits) — components from those must never be used, even when a name looks like an exact match. See [workflow-code-and-figma.md](workflow-code-and-figma.md)'s hard constraint for the full rule and why it matters.

**Verified componentKeys** (confirmed directly against the DS - React file — reuse these rather than re-searching):

| Component | Node ID | componentKey |
|---|---|---|
| Left side menu (component set: Collapsed/Expanded) | `59867:98373` | `8f8adc5e5ef2e846b0ae8bd1711018bc354b498d` |
| Top bar - desktop | `64911:413329` | `9e5ea214d1f11f0ce744703edb0242822a4bbfdb` |

Add a row here whenever a new component's key gets confirmed during a Figma build — this table exists specifically so the same lookup doesn't need repeating.

## Desktop replacements

The source spreadsheet has two link columns: **"Mobile & desktop component"** (most components use the same design on both platforms) and **"Desktop only"** (populated only for the handful of components that look and behave differently on desktop). **When a row has a value in the "Desktop only" column, that desktop component *replaces* the "Mobile & desktop component" one whenever the screen being built is desktop** — they are not two separate components to choose between per-taste, they're the same conceptual UI element with a platform-specific implementation. This is the same pattern already documented for the Top Bar in [desktop-layout.md](desktop-layout.md) and for the Dropdown/Tooltip/Left Side Menu components — this table is the authoritative list of which components have that split.

| Component | Mobile & desktop component (default) | Desktop only (replaces the default on desktop) |
|---|---|---|
| Top bar | [`45130:154418`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45130-154418&t=GIQFaGQLuBGP37oS-1) | [`64911:413329`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64911-413329&t=mbOcCk998Uq0gDQL-1) — matches [desktop-layout.md](desktop-layout.md)'s Top Bar section exactly. |
| Tooltip | [`38919:153960`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38919-153960&t=GIQFaGQLuBGP37oS-1) | [`64875:77910`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64875-77910&t=mbOcCk998Uq0gDQL-1) — matches the Desktop Tooltip already in [component-tiers.md](component-tiers.md). |
| Side menu | [`59891:207300`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59891-207300) | [`59867:98373`](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59867-98373&t=mbOcCk998Uq0gDQL-1) — matches the Left Side Menu already documented as a global requirement in [desktop-layout.md](desktop-layout.md). |

The desktop link that was on the spreadsheet's "_Tooltip no overlay" row was removed here — that node is independently confirmed (via the full-file component sweep) to actually be named "Dropdown" on the "Desktop Components" page, not a tooltip variant, so it isn't a real desktop replacement for that atom. The desktop replacement applies only to "Tooltip" itself, above.

All three pairings above independently confirm work already done in this skill (Top bar, Tooltip, Side menu all match what the Code Connect sweep and Figma inspection found) — good cross-validation.

## Top-level components (check these for tiering)

| Component name (Figma) | Node ID | Link |
|---|---|---|
| Screen layout | `37990:252592` | [Screen layout](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37990-252592&t=zgmYyI6k6XH0aY2Z-1) |
| Empty state | `48645:7889` | [Empty state](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=48645-7889&t=EKddnVidYoG5KUTQ-1) |
| Intro | `48487:2952` | [Intro](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=48487-2952&t=zgmYyI6k6XH0aY2Z-1) |
| Story | `48487:2952` | [Story](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=48487-2952&t=zgmYyI6k6XH0aY2Z-1) |
| Background | `49002:48613` | [Background](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49002-48613&t=zgmYyI6k6XH0aY2Z-1) |
| Top bar | `45130:154418` | [Top bar](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45130-154418&t=GIQFaGQLuBGP37oS-1) |
| Header | `37991:369287` | [Header](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37991-369287&t=EKddnVidYoG5KUTQ-1) |
| Footer | `38411:399666` | [Footer](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38411-399666&t=EKddnVidYoG5KUTQ-1) |
| Section | `38041:226058` | [Section](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38041-226058&t=EKddnVidYoG5KUTQ-1) |
| Context area | `38041:226058` | [Context area](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38041-226058&t=EKddnVidYoG5KUTQ-1) |
| Show more | `44118:71950` | [Show more](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=44118-71950&t=EKddnVidYoG5KUTQ-1) |
| Default card | `64597:38764` | [Default card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64597-38764&t=EKddnVidYoG5KUTQ-1) |
| Media card | `30076:80103` | [Media card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30076-80103&t=EKddnVidYoG5KUTQ-1) |
| Collapsable card | `34186:187621` | [Collapsable card](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34186-187621&t=EKddnVidYoG5KUTQ-1) |
| Bottom-sheet header | `37462:349084` | [Bottom-sheet header](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37462-349084&t=GIQFaGQLuBGP37oS-1) |
| Botton-sheet | `37475:404654` | [Botton-sheet](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37475-404654&t=GIQFaGQLuBGP37oS-1) |
| Bottom sheet dialog header | `38704:283192` | [Bottom sheet dialog header](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38704-283192&t=GIQFaGQLuBGP37oS-1) |
| Tooltip | `38919:153960` | [Tooltip](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38919-153960&t=GIQFaGQLuBGP37oS-1) |
| Dropdown | `38711:313020` | [Dropdown](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38711-313020&t=EKddnVidYoG5KUTQ-1) |
| Tiles types | `37967:347608` | [Tiles types](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37967-347608&t=EKddnVidYoG5KUTQ-1) |
| Tiles states | `37890:312123` | [Tiles states](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37890-312123&t=EKddnVidYoG5KUTQ-1) |
| Switch tiles types | `37967:292229` | [Switch tiles types](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37967-292229&t=EKddnVidYoG5KUTQ-1) |
| Combo tile types | `37967:347642` | [Combo tile types](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37967-347642&t=EKddnVidYoG5KUTQ-1) |
| Tiles  start Emphasized | `53314:179817` | [Tiles  start Emphasized](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=53314-179817&t=EKddnVidYoG5KUTQ-1) |
| Tiles end Emphasized | `53314:181998` | [Tiles end Emphasized](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=53314-181998&t=EKddnVidYoG5KUTQ-1) |
| Contextual action bar | `59358:40134` | [Contextual action bar](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59358-40134&t=EKddnVidYoG5KUTQ-1) |
| Accordion | `23856:273227` | [Accordion](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=23856-273227&t=EKddnVidYoG5KUTQ-1) |
| Question | `23856:273004` | [Question](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=23856-273004&t=EKddnVidYoG5KUTQ-1) |
| Centered title & subtitle | `42631:11303` | [Centered title & subtitle](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=42631-11303&t=EKddnVidYoG5KUTQ-1) |
| Skeleton | `34382:263536` | [Skeleton](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34382-263536&t=EKddnVidYoG5KUTQ-1) |
| Tabs group | `50529:19526` | [Tabs group](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=50529-19526&t=zgmYyI6k6XH0aY2Z-1) |
| Pagination | `38404:399609` | [Pagination](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38404-399609&t=zgmYyI6k6XH0aY2Z-1) |
| Progress pagination | `42726:10421` | [Progress pagination](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=42726-10421&t=zgmYyI6k6XH0aY2Z-1) |
| Wizard | `65383:118190` | [Wizard](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=65383-118190&t=zgmYyI6k6XH0aY2Z-1) |
| Progress wizard | `48325:156700` | [Progress wizard](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=48325-156700&t=zgmYyI6k6XH0aY2Z-1) |
| Nav bar | `45609:105489` | [Nav bar](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45609-105489&t=EKddnVidYoG5KUTQ-1) |
| Side menu | `59891:207300` | [Side menu](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59891-207300) |
| Island | `33916:173533` | [Island](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=33916-173533&t=EKddnVidYoG5KUTQ-1) |
| Button | `46726:155913` | [Button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=46726-155913&t=GIQFaGQLuBGP37oS-1) |
| Icon button | `30143:157389` | [Icon button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30143-157389&t=GIQFaGQLuBGP37oS-1) |
| FAB | `46854:94754` | [FAB](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=46854-94754&t=GIQFaGQLuBGP37oS-1) |
| Fab action items | `47512:179927` | [Fab action items](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=47512-179927&t=GIQFaGQLuBGP37oS-1) |
| Fab menu | `34497:184774` | [Fab menu](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34497-184774&t=GIQFaGQLuBGP37oS-1) |
| Badge button | `34688:160218` | [Badge button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34688-160218&t=GIQFaGQLuBGP37oS-1) |
| Glass button | `65031:362691` | [Glass button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=65031-362691&t=GIQFaGQLuBGP37oS-1) |
| Quick action | `51319:201407` | [Quick action](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=51319-201407&t=GIQFaGQLuBGP37oS-1) |
| Buy and sell buttons | `49622:8419` | [Buy and sell buttons](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49622-8419&t=GIQFaGQLuBGP37oS-1) |
| Tool bar | `48949:19118` | [Tool bar](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=48949-19118&t=GIQFaGQLuBGP37oS-1) |
| Link | `30145:176361` | [Link](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30145-176361&t=EKddnVidYoG5KUTQ-1) |
| Filter chip | `49622:8908` | [Filter chip](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49622-8908&t=GIQFaGQLuBGP37oS-1) |
| Input chip | `49622:9328` | [Input chip](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49622-9328&t=GIQFaGQLuBGP37oS-1) |
| Choise chip | `49622:11498` | [Choise chip](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49622-11498&t=GIQFaGQLuBGP37oS-1) |
| Chips group | `30145:272437` | [Chips group](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30145-272437&t=GIQFaGQLuBGP37oS-1) |
| Window group | `37092:394103` | [Window group](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=37092-394103&t=zgmYyI6k6XH0aY2Z-1) |
| Toggle switch | `30145:253554` | [Toggle switch](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30145-253554&t=GIQFaGQLuBGP37oS-1) |
| Toggle group | `30145:253554` | [Toggle group](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30145-253554&t=GIQFaGQLuBGP37oS-1) |
| Radio button list | `34812:162915` | [Radio button list](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34812-162915&t=EKddnVidYoG5KUTQ-1) |
| Checkbox | `36823:206574` | [Checkbox](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=36823-206574&t=GIQFaGQLuBGP37oS-1) |
| Round checkbox | `14664:12811` | [Round checkbox](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=14664-12811&t=GIQFaGQLuBGP37oS-1) |
| Add checkbox | `4970:8617` | [Add checkbox](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=4970-8617&t=GIQFaGQLuBGP37oS-1) |
| Slider | `65351:10042` | [Slider](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=65351-10042&t=GIQFaGQLuBGP37oS-1) |
| Keyboard range slider | `36206:211626` | [Keyboard range slider](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=36206-211626&t=GIQFaGQLuBGP37oS-1) |
| Range slider | `36206:211626` | [Range slider](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=36206-211626&t=GIQFaGQLuBGP37oS-1) |
| Loader | `46337:110012` | [Loader](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=46337-110012&t=EKddnVidYoG5KUTQ-1) |
| Progress bar | `30834:143165` | [Progress bar](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30834-143165&t=EKddnVidYoG5KUTQ-1) |
| Progress Bar with Label | `33460:152030` | [Progress Bar with Label](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=33460-152030&t=EKddnVidYoG5KUTQ-1) |
| Steps Progress | `41641:123871` | [Steps Progress](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=41641-123871&t=EKddnVidYoG5KUTQ-1) |
| Wizard | `64967:60564` | [Wizard](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=64967-60564&t=EKddnVidYoG5KUTQ-1) |
| Range | `35071:247691` | [Range](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=35071-247691&t=EKddnVidYoG5KUTQ-1) |
| Countdown | `59166:23499` | [Countdown](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59166-23499&t=EKddnVidYoG5KUTQ-1) |
| Risk score | `41272:214360` | [Risk score](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=41272-214360&t=EKddnVidYoG5KUTQ-1) |
| gauge/chrono | `52437:71156` | [gauge/chrono](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=52437-71156&t=EKddnVidYoG5KUTQ-1) |
| Toast | `57374:69701` | [Toast](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=57374-69701&t=MncNoH8hH7AhBjCC-1) |
| Banner | `62699:127542` | [Banner](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=62699-127542&t=MncNoH8hH7AhBjCC-1) |
| System message | `56917:63906` | [System message](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=56917-63906&t=MncNoH8hH7AhBjCC-1) |
| Tag badge | `36924:210794` | [Tag badge](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=36924-210794&t=MncNoH8hH7AhBjCC-1) |
| Counter badge | `34391:340451` | [Counter badge](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=34391-340451&t=MncNoH8hH7AhBjCC-1) |
| Avatars badge | `59947:135252` | [Avatars badge](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=59947-135252&t=MncNoH8hH7AhBjCC-1) |
| Status badge | `54149:156208` | [Status badge](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=54149-156208&t=MncNoH8hH7AhBjCC-1) |
| Popover | `30894:497811` | [Popover](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30894-497811&t=MncNoH8hH7AhBjCC-1) |
| Text input | `40034:200268` | [Text input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=40034-200268&t=mbOcCk998Uq0gDQL-1) |
| Password text input | `40565:129810` | [Password text input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=40565-129810&t=mbOcCk998Uq0gDQL-1) |
| Code input button | `38071:763500` | [Code input button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=38071-763500&t=mbOcCk998Uq0gDQL-1) |
| Phone Input | `40170:123303` | [Phone Input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=40170-123303&t=mbOcCk998Uq0gDQL-1) |
| Search field | `45130:121670` | [Search field](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45130-121670&t=mbOcCk998Uq0gDQL-1) |
| Search Input | `31122:111363` | [Search Input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=31122-111363&t=mbOcCk998Uq0gDQL-1) |
| Primary amount input with button | `39650:239006` | [Primary amount input with button](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=39650-239006&t=mbOcCk998Uq0gDQL-1) |
| Primary amount input | `39650:239006` | [Primary amount input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=39650-239006&t=mbOcCk998Uq0gDQL-1) |
| Secondary amount input | `39842:195854` | [Secondary amount input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=39842-195854&t=mbOcCk998Uq0gDQL-1) |
| Stepper | `31092:305017` | [Stepper](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=31092-305017&t=mbOcCk998Uq0gDQL-1) |
| Select | `45204:104444` | [Select](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45204-104444&t=mbOcCk998Uq0gDQL-1) |
| Date picker | `46825:61909` | [Date picker](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=46825-61909&t=mbOcCk998Uq0gDQL-1) |
| Time picker | `49339:4674` | [Time picker](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=49339-4674&t=mbOcCk998Uq0gDQL-1) |
| List | `30894:468953` | [List](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30894-468953) |
| Table | `55105:79736` | [Table](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=55105-79736&t=mbOcCk998Uq0gDQL-1) |
| Line charts components | `62599:18117` | [Line charts components](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=62599-18117&t=mbOcCk998Uq0gDQL-1) |
| Bar charts components | `50188:170389` | [Bar charts components](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=50188-170389&t=mbOcCk998Uq0gDQL-1) |
| Tree map | `43627:85607` | [Tree map](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=43627-85607&t=mbOcCk998Uq0gDQL-1) |
| Break down chart | `53339:26696` | [Break down chart](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=53339-26696&t=mbOcCk998Uq0gDQL-1) |
| Post | `42488:18119` | [Post](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=42488-18119&t=mbOcCk998Uq0gDQL-1) |
| Post comments | `51516:78476` | [Post comments](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=51516-78476&t=mbOcCk998Uq0gDQL-1) |
| Pinned post | `42631:10204` | [Pinned post](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=42631-10204&t=mbOcCk998Uq0gDQL-1) |
| Video thumbnail | `58488:21021` | [Video thumbnail](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=58488-21021&t=mbOcCk998Uq0gDQL-1) |
| Comments input | `51635:48510` | [Comments input](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=51635-48510&t=mbOcCk998Uq0gDQL-1) |
| Story thumbnail | `30459:89531` | [Story thumbnail](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=30459-89531&t=mbOcCk998Uq0gDQL-1) |
| Poll | `45574:123635` | [Poll](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45574-123635&t=mbOcCk998Uq0gDQL-1) |
| Answers | `45430:5602` | [Answers](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45430-5602&t=mbOcCk998Uq0gDQL-1) |
| Answer background | `45446:2061` | [Answer background](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=45446-2061&t=mbOcCk998Uq0gDQL-1) |
| Image | `51555:117183` | [Image](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=51555-117183&t=mbOcCk998Uq0gDQL-1) |
| Add image | `63971:77912` | [Add image](https://www.figma.com/design/cMyPhFndkPeXR6UkIuZujT/DS---React?node-id=63971-77912&t=mbOcCk998Uq0gDQL-1) |

## Atoms / subcomponents (do NOT tier separately — see SKILL.md)

These names begin with `_` in the source spreadsheet, marking them as internal building blocks of a parent component listed above (e.g. `_Tab` is the button used inside `Tabs group`) rather than standalone components a designer would place directly. Skip these when tiering — they inherit their parent component's tier.

| Atom name (Figma) | Node ID | Likely parent |
|---|---|---|
| _Top bar actions | `44143:113069` | Top bar |
| _Header content | `35791:360535` | Header |
| _Bottom sheet types no overlay | `37462:334059` | Bottom-sheet |
| _Dialog bottom sheet no overlay | `38704:283487` | Bottom sheet dialog header |
| _Tooltip no overlay | `38919:153898` | Tooltip |
| _Tiles slot | `37977:40895` | Tiles types |
| _Tab | `49470:14221` | Tabs group |
| _Progress pagination indicator | `42726:10392` | Progress pagination |
| _Progress pagination container | `42726:11241` | Progress pagination |
| _Nav bar button | `45609:91191` | Nav bar |
| _Side menu list | `60164:29469` | Side menu |
| _Clubs | `65377:381640` | Side menu |
| _Toggle group button | `30145:253246` | Toggle group |
| _Radio button | `34812:162657` | Radio button list |
| _Code input | `57288:28376` | Code input button |
| _Search Field | `45130:121655` | Search field |
| _Search Input | `31122:111330` | Search Input |
| _Secondary amount Input | `30906:462657` | Secondary amount input |
| _Stepper states | `31130:335438` | Stepper |
| _Cells slots | `59340:120480` | Table |
| _Columns | `55089:79844` | Table |
| _Tree map items | `35976:120808` | Tree map |
