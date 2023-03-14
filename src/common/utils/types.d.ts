declare module '@ckeditor/ckeditor5-react';
declare module '@ckeditor/ckeditor5-alignment/src/alignment';
declare module '@ckeditor/ckeditor5-basic-styles/src/code';
declare module '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
declare module '@ckeditor/ckeditor5-basic-styles/src/subscript';
declare module '@ckeditor/ckeditor5-basic-styles/src/superscript';
declare module '@ckeditor/ckeditor5-basic-styles/src/underline';
declare module '@ckeditor/ckeditor5-basic-styles/src/bold';
declare module '@ckeditor/ckeditor5-basic-styles/src/italic';
declare module '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
declare module '@ckeditor/ckeditor5-code-block/src/codeblock';
declare module '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
declare module '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
declare module '@ckeditor/ckeditor5-font/src/font';
declare module '@ckeditor/ckeditor5-highlight/src/highlight';
declare module '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
declare module '@ckeditor/ckeditor5-html-embed/src/htmlembed';
declare module '@ckeditor/ckeditor5-link/src/autolink';
declare module '@ckeditor/ckeditor5-link/src/linkimage';
declare module '@ckeditor/ckeditor5-link/src/link';
declare module '@ckeditor/ckeditor5-list/src/listproperties';
declare module '@ckeditor/ckeditor5-list/src/todolist';
declare module '@ckeditor/ckeditor5-page-break/src/pagebreak';
declare module '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
declare module '@ckeditor/ckeditor5-remove-format/src/removeformat';
declare module '@ckeditor/ckeditor5-source-editing/src/sourceediting';
declare module '@ckeditor/ckeditor5-table/src/table';
declare module '@ckeditor/ckeditor5-table/src/tabletoolbar';
declare module '@ckeditor/ckeditor5-table/src/tablecaption';
declare module '@ckeditor/ckeditor5-table/src/tablecellproperties';
declare module '@ckeditor/ckeditor5-table/src/tablecolumnresize';
declare module '@ckeditor/ckeditor5-table/src/tableproperties';
declare module '@ckeditor/ckeditor5-typing/src/texttransformation';
declare module '@ckeditor/ckeditor5-typing/src/input';
declare module '@ckeditor/ckeditor5-undo/src/undo';
declare module '@ckeditor/ckeditor5-select-all/src/selectall';
declare module '@ckeditor/ckeditor5-heading/src/heading';
declare module '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
declare module '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
declare module '@ckeditor/ckeditor5-block-quote/src/blockquote';
declare module '@ckeditor/ckeditor5-media-embed/src/mediaembed';
declare module '@ckeditor/ckeditor5-indent/src/indent';
declare module '@ckeditor/ckeditor5-indent/src/indentblock';
declare module '@ckeditor/ckeditor5-image/src/image';
declare module '@ckeditor/ckeditor5-image/src/imagetoolbar';
declare module '@ckeditor/ckeditor5-image/src/imagecaption';
declare module '@ckeditor/ckeditor5-image/src/imagestyle';
declare module '@ckeditor/ckeditor5-image/src/imageresize';
declare module '@ckeditor/ckeditor5-link/src/linkimage';

type Ratio =
  | 'logo'
  | '1x1'
  | '3x2'
  | '4x3'
  | '16x9'
  | '9x16'
  | '436x200'
  | '264x176'
  | '206x438';

type OptionType = {
  label: string;
  value?: number | string | null;
};

type ActionRoles = {
  roleCreate: boolean;
  roleUpdate: boolean;
  roleDelete: boolean;
};

type ActiveRoles = {
  roleIndex: boolean;
  roleView: boolean;
  roleOther: string[];
} & ActionRoles;

type SelectImageData = {
  path: string;
  title?: string;
  alt?: string;
};
