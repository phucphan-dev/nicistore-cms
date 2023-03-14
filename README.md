# Hi, We are <a href="https://3forcom.com" target="_blank">3FORCOM</a> <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px">

## Glad to see you here!
## About Project

## Repository

<>

## Design Workspace

<>


## Languages and Frameworks

- CRA
- TypeScript v4.6.4
- SCSS (sass)
- React v18
- Babel v8
- Hygen
- Storybook v6
- ESLint
- Stylelint
- Redux
- Redux-toolkit
- ...

## Files/Directories

| Path                    | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| /.storybook/            | contains Storybook config files                             |
| /.eslintrc              | settings for `ESLint`                                       |
| /.hygen.js              | settings for `Hygen`                                        |
| /_templates/            | contains scaffolding templates based on `Hygen`             |
| /.stylelintrc.js        | settings for `Stylelint`                                    |
| /.vscode/               | settings for `Visual Studio Code` workspace                 |
| /package.json           | manifest file for Node.js projects                          |
| /tsconfig.json          | settings for `TypeScript`                                   |
| /dist/                  | contains production build codes                             |
| /public/                | root folder that gets served up as our react app.           |
| /src/components/        | contains Atomic Design components                           |
| /src/container/         | contains Logic handler                                      |
| /src/pages/             | contains pages                                              |
| /src/assets/            | contains images, movies, fonts                              |
| /src/store/             | contains shared store                                       |
| /src/services/          | contains shared services                                    |
| /src/styles/            | contains common styles: breakpoints, colors, font, mixin, function               |
| /src/index.tsx/         | contains root file                                          |
| /src/App.tsx            | contains application page index                             |
| /src/index.scss         | contains shared styles                                      |
| /src/react-app-env.d.ts | contains shared types                                       |
---

## Command Line

| Path                    | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| yarn start              | start the project                                           |
| yarn buid               | build the project                                           |
| yarn test               | run unit test                                               |
| gen:component           | generate new `atomic` component                             |
| gen:page                | generate new page                                           |
| yarn storybook          | run the storybook                                           |
| yarn lint:script        | run `Eslint` to check the syntax                            |
| yarn lint:style         | run `Stylelint` to check the syntax                         |
---

### `Abem`

<https://css-tricks.com/abem-useful-adaptation-bem/>

**Note: Use only the `lowercase` format for `className`.**

```tsx
  //GOOD 🏆🏆🏆
  export const Sample:React.FC = ({ children }) => (
    <div className="a-sample">{children}</div>
  );


  //NOT GOOD 💩💩💩
  export const Sample:React.FC = ({ children }) => (
    <div className="a-Sample">{children}</div>
  );
```

**Note: Use only the `Single_Underscore(_) && Single-Dash(-)` format for `className`.**

```tsx
  //GOOD 🏆🏆🏆
  export const Sample = () => (
    <div className="a-sample">
      <span className="a-sample_title">Title</span>
    </div>
  );


  //NOT GOOD 💩💩💩
  export const Sample = () => (
    <div className="a--sample">
      <span className="a--sample__title">Title</span>
    </div>
  );
```

**Note: The `className` must be formatted as `block_element-modifier`. But `Sometimes` it will be formatted as `block_element_element-modifier`.**

```tsx
  //GOOD 🏆🏆🏆
  export const Sample = () => (
    <div className="a-sample">
      <span className="a-sample_element">One Element</span>
    </div>
  );

  export const Sample = () => (
    <div className="a-sample">
      <span className="a-sample_element1_element2">Two elements</span>
    </div>
  );


  //NOT GOOD 💩💩💩
  export const Sample = () => (
    <div className="a-sample">
      <span className="a-sample_element1_element2_element3">Greater than 2 elements</span>
    </div>
  );
```

### `Atomic`

<https://bradfrost.com/blog/post/atomic-web-design/>

### `Components`

- Use only `React-Hook`
- Follow the `rules of hook` (<https://reactjs.org/docs/hooks-rules.html>)

**Note: Use `mapModifiers` to generate `modifiers`.**

```tsx
  export const Component: React.FC<Props> = props => (
    <div className={mapModifiers('a-sample', props.modifiers)}>{props.children}</div>
  );
```

**Note: Use `// eslint-disable-next-line react-hooks/exhaustive-deps` when you want to avoid checking of the `useEffect` syntax (also on `useMemo & useCallback`)**

```tsx
  useEffect(() => {
    Todo Something...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
```

**Note: Use simple syntax when the component has no properties.**

```tsx
  //GOOD 🏆🏆🏆
  export const Component = () => (
    <div>Without children...</div>
  );

  export const Component: React.FC = ({ children }) => (
    <div>{children}</div>
  );


  //NOT GOOD 💩💩💩
  export const Component: React.FC = () => (
    <div>Without children...</div>
  );
```

**Note: Clearly define the data type of the property.**

```tsx
  //GOOD 🏆🏆🏆
  interface Props {
    title: string;
  }

  //NOT GOOD 💩💩💩
  interface Props {
    title: any;
  }
```

**Note: Please leave TODO when you encounter some unresolved issues immediately.**

```tsx
  export const Component = () => {

    // TODO: bla...bla...bla
    const Problems = 'Problems';

    return (
      <div>Todo Something...</div>
    );
  };
```

**Note: Use the filename as the component name. For example, Example.tsx should have a reference name of Example. However, for root components of a directory, use index.jsx as the filename and use the directory name as the component name:**

```tsx
  //GOOD 🏆🏆🏆
  import Example from 'components/atoms/Example';

  //NOT GOOD 💩💩💩
  import Example from 'components/atoms/Example/index';
```

### `CSS/SCSS`

**Note: Instead of using `Color Variables`, do `NOT` use `Color Codes`. If the color code has not been defined. Please leave `TODO` about that.**

```scss
  .a-sample {
    // TODO: Replace with color variable
    color: rgb(0, 0, 0);
  }
```

**Note: Instead of using `Color Variable` defined at `styles/colors.scss` and you can get name of color at   https://hexcol.com/   , do `NOT` use `Color Names | Color Hexs | ...`.**

```scss
  //GOOD 🏆🏆🏆
  .a-sample {
    // TODO: Replace with color variable
    color: $black;
  }

  //NOT GOOD 💩💩💩
  .a-sample {
    // TODO: Replace with color variable
    color: black; /* stylelint-disable-line color-named */
  }
```

**Note:  Please Use `font-family: $font-family-variable`, not Use `font-family: 'Font Name'` .**

```scss
  //GOOD 🏆🏆🏆
  .a-sample {
    // TODO: Replace with font-family variable
    font-family: $anotherFont;
  }

  //NOT GOOD 💩💩💩
  .a-sample {
    font-family: 'AnotherFont';
  }
```

**Note: Please use `@function rem` with the properties have dynamic values (Scale-up and Scale-down). rem($SizeOnDesign)**

```scss
  //GOOD 🏆🏆🏆
  .a-sample {
    border-radius: 4px;
    font-size: rem(16);
  }

  //NOT GOOD 💩💩💩
  .a-sample {
    border-radius: 4px;
    font-size: 16px;
  }
```

**Note: Instead of using `z-index: $variables`, do `NOT` use `z-index value`. Please define the `zIndex variable` before using that function. Please follow the instructions at `styles/variables.scss`**

```scss
  //GOOD 🏆🏆🏆
  .a-sample {
    z-index: $z-sample;
  }

  //NOT GOOD 💩💩💩
  .a-sample {
    z-index: 4;
  }
```

### `Storybook`

**Note: Make sure that you have included all instances of the component in the storybook when building it.**

### `Unit Test`

- enzyme: <https://enzymejs.github.io/enzyme/docs/api/>
- jest: <https://jestjs.io/docs/en/25.x/getting-started.html>
- testing-library/react-hooks: <https://react-hooks-testing-library.com/usage/basic-hooks>

**Note: Make full test coverage for the component. If `NOT`, please notify your Leader.**

### `Typescript`

<https://www.typescriptlang.org/index.htm>

### `Redux/Redux-Toolkit`

- redux: <https://redux.js.org/>
- redux-toolkit: <https://redux-toolkit.js.org/>

### `React-router-dom`

<https://reactrouter.com/web/guides/quick-start>

### `Naming`

1. Service: `[serviceName]` + Service
```ts
  const getSystemDataService = async () => {
    // api handler
  }
```
2. Response / Request Params type: `[TypeName / RequestParamsName]` + Types
```tsx
  type SystemDataTypes = {
    // ...
  }

  type SystemParamsTypes = {
    // ...
  }
```
3. Store:
  - Reducer: `[Name]` + Reducer
  - Action: `[ActionName]` + Action
  - Action Prefix: `[ReducerName]/[ActionName]`
  - Slice: `[Name]` + Slice
  ```ts
    export const getSystemDataAction = createAsyncThunk<SystemDataTypes>(
      'systemReducer/getSystemDataAction',
      async (_, { rejectWithValue }) => {
        // ...
      },
    );

    export const systemSlice = createSlice({
      // ...
    })
  ```
4. Colors: <https://hexcol.com/> Enter code => Get Color name

### `Git`

- Rebase: <https://git-scm.com/docs/git-rebase>
- Git branch format: <http://karma-runner.github.io/5.0/dev/git-commit-msg.html>

**Note: When create a new branch. The `type` will include `feature | bugfix | hotfix | release | support`**

```ssh
  git checkout -b type/feature-name
```

**Note: When committed. The `type` will include `feat | fix | hotfix | release | support`**

```ssh
  git commit -m ':emoji: type(feature-name): messages'
```

Commit Type | Emoji <https://gist.github.com/parmentf/035de27d6ed1dce0b36a>
----------  | -----
Initial Commit | [🎉  Party Popper](http://emojipedia.org/party-popper/)
Version Tag | [🔖  Bookmark](http://emojipedia.org/bookmark/)
New Feature | [✨  Sparkles](http://emojipedia.org/sparkles/)
Bugfix | [🐛  Bug](http://emojipedia.org/bug/)
Security Fix | [🔒  Lock](https://emojipedia.org/lock/)
Metadata | [📇  Card Index](http://emojipedia.org/card-index/)
Refactoring | [♻️  Black Universal Recycling Symbol](http://emojipedia.org/black-universal-recycling-symbol/)
Documentation | [📚  Books](http://emojipedia.org/books/)
Internationalization | [🌐  Globe With Meridians](http://emojipedia.org/globe-with-meridians/)
Accessibility | [♿  Wheelchair](https://emojipedia.org/wheelchair-symbol/)
Performance | [🐎  Horse](http://emojipedia.org/horse/)
Cosmetic | [🎨  Artist Palette](http://emojipedia.org/artist-palette/)
Tooling | [🔧  Wrench](http://emojipedia.org/wrench/)
Tests | [🚨  Police Cars Revolving Light](http://emojipedia.org/police-cars-revolving-light/)
Deprecation | [💩  Pile of Poo](http://emojipedia.org/pile-of-poo/)
Removal | [🗑️  Wastebasket](http://emojipedia.org/wastebasket/)
Work In Progress (WIP) | [🚧  Construction Sign](http://emojipedia.org/construction-sign/)
See more | [Be creative](http://www.emoji-cheat-sheet.com/)

## Generate Template
-   Generate component: `yarn gen:component → select level → enter component's name`
-   Generate page: `yarn gen:page → enter component's name`
## Quy Trình Rebase
### Rebase để làm gì?
- Dùng để thay thế cho merge, nhưng tiếp cận theo 1 hướng khác
- Xử lý conflict
- Lấy code mới từ nhánh chính về
### Tại sao lại là rebase?
- Khi merge sẽ giải quyết tất cả conflict trong một commit, sẽ gây khó khăn trong việc giải quyết conflict
- Rebase sẽ giải quyết conflict ở ngay chính commit gây ra conflict, sẽ giúp dễ dàng xử lý conflict
- Khi rebase để xủ lý conflict, trường hợp xấu nhất mình vẫn có thể checkout và code lại commit đó từ đầu theo nội dung của commit message
- Merge sẽ lấy code của nhánh phụ làm code chính, nên dễ gây đè code, còn rebase sẽ lấy code của nhánh chính làm chính
- Khi rebase thì nhánh git sẽ gọn và trực quan hơn
- Rebase còn giúp ích cho các công việc quản lý khác
### Khi nào thì cần rebase?
- Rebase khi muốn lấy code từ nhánh develop về nhánh mình
- Khi gặp conflict phải resolve bằng rebase,
- Nên rebase thường xuyên (khi có commit mới ở develop) và rebase trước khi tạo pull request, tránh trường hợp gặp khó khăn khi rebase quá nhiều commit
### Quy trình rebase
1. lấy code mới nhất từ remote về và tiến hành rebase lên nhánh chính
- ```git fetch```
- ```git rebase origin/develop```
2. xử lý conflict nếu có
trong trường hợp xấu nhất thì checkout lại file bị conflict và code lại theo commit cũ tương ứng

// rebase trên branch chỉ có 1 người code đồng thời thì sẽ đơn giản, nhưng nếu 2 người code cùng lúc thì sẽ thêm nhiều case phải handle hơn, nhưng theo git-flow thì mình đã hạn chế trường hợp 1 branch nhiều người code cùng 1 thời điểm rồi

3. cần phải check kỹ code hiện tại sau khi rebase, phải đảm bảo tương đương code cũ, không bị lỗi, ...

4. chạy lệnh sau để chính thức đè code của mình lên remote ```git push --force-with-lease```

### Quy trình hotfix
1. Khi nào sẽ cần hotfix
- Khi cần fix gấp các ```lỗi nghiêm trọng```, không thể merge nhánh development vào nhánh production được.
- Có thể dùng để phát triển 1 tính năng gấp cho production, ```nhưng không nên lạm dụng```

2. Các bước thực hiện
- Nhánh hotfix phải tách ra từ nhánh production (sẽ khác nhau ở mỗi dự án), tên nhánh có dạng hotfix/<tên-nhánh>
- Tạo 2 PR từ 1 nhánh hotfix đó vào production và development lại, phải merge vào production trước
- Các bước tiếp theo phải thực hiện theo đúng thứ tự sau đây:

  - Xử lý conflict của PR vào production (nếu có)
  - Merge PR vào production, nhưng không được xoá nhánh
  - Xử lý conflict của PR vào development (nếu có)
  - Merge PR vào development, tick vào ô xoá nhánh

### Quy trình tách nhánh
- Tất cả các nhánh đều được tách từ nhánh chính là `develop`
- Trường hợp nhánh phụ có các nhánh con nữa thì checkout từ nhánh phụ, làm và merge vào nhánh phụ. Sau đó merge nhánh phụ vào nhánh chính là `develop`