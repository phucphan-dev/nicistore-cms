/* eslint-disable import/no-extraneous-dependencies */
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import Font from '@ckeditor/ckeditor5-font/src/font';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink';
import Link from '@ckeditor/ckeditor5-link/src/link';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SelectAll from '@ckeditor/ckeditor5-select-all/src/selectall';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableColumnResize from '@ckeditor/ckeditor5-table/src/tablecolumnresize';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Input from '@ckeditor/ckeditor5-typing/src/input';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import Undo from '@ckeditor/ckeditor5-undo/src/undo';
import React from 'react';

import OCFinder from './ocfinder';

type EditorProps = {
  value?: any;
  handleChange?: (_event: any, editor: any) => void;
};

export const SimpleEditor: React.FC<EditorProps> = ({ value, handleChange }) => (
  <CKEditor
    editor={ClassicEditor}
    data={value}
    onChange={handleChange}
    config={{
      plugins: [
        Underline, Strikethrough, RemoveFormat,
        Font, Highlight,
        TodoList, ListProperties, TableProperties,
        TableCellProperties, TableCaption, TableColumnResize, Table, TableToolbar,
        Link, AutoLink, TextTransformation, Input,
        Alignment,
        Indent, IndentBlock,
        SourceEditing,
        Undo, SelectAll, Heading,
        Bold, Italic,
        BlockQuote, MediaEmbed,
        Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage,
        OCFinder,
      ],
      toolbar: {
        items: [
          'sourceEditing', 'undo', 'redo',
          '|',
          'heading',
          '|',
          'bold', 'italic', 'strikethrough', 'underline',
          '-',
          'highlight', 'fontSize', 'fontColor', 'fontBackgroundColor',
          '|',
          'outdent', 'indent', 'alignment',
          '|',
          'bulletedList', 'numberedList', 'todoList',
          '|',
          'removeFormat', 'blockQuote', 'insertTable',
          '|',
          'insertOCImage'
        ],
        shouldNotGroupWhenFull: true
      },
      fontFamily: {
        supportAllValues: true
      },
      fontSize: {
        options: ['default', 10, 14, 16, 18, 20, 22, 24, 32, 36],
        supportAllValues: true
      },
      htmlEmbed: {
        showPreviews: true
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      link: {
        decorators: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      image: {
        styles: [
          'alignCenter',
          'alignLeft',
          'alignRight'
        ],
        resizeOptions: [
          {
            name: 'resizeImage:original',
            label: 'Original',
            value: null
          },
          {
            name: 'resizeImage:50',
            label: '50%',
            value: '50'
          },
          {
            name: 'resizeImage:75',
            label: '75%',
            value: '75'
          }
        ],
        toolbar: [
          'imageTextAlternative', 'toggleImageCaption', '|',
          'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side', '|',
          'resizeImage'
        ],
        insert: {
          integrations: [
            'insertImageViaUrl'
          ]
        }
      },
      placeholder: 'Type or paste your content here!',
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
        ]
      },
    }}
  />
);

const Editor: React.FC<EditorProps> = ({ value, handleChange }) => (
  <CKEditor
    editor={ClassicEditor}
    data={value}
    onChange={handleChange}
    config={{
      plugins: [
        Underline, Strikethrough, Superscript, Subscript, Code, RemoveFormat,
        FindAndReplace, Font, Highlight,
        CodeBlock, TodoList, ListProperties, TableProperties,
        TableCellProperties, TableCaption, TableColumnResize, Table, TableToolbar,
        HtmlEmbed,
        Link, AutoLink, TextTransformation, Input,
        Alignment,
        Indent, IndentBlock,
        PasteFromOffice, PageBreak, HorizontalLine,
        CloudServices, SourceEditing,
        Undo, SelectAll, Heading,
        Bold, Italic,
        SpecialCharacters, SpecialCharactersEssentials,
        BlockQuote, MediaEmbed,
        Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize, LinkImage,
        OCFinder,
      ],
      toolbar: {
        items: [
          'sourceEditing', 'undo', 'redo',
          '|',
          'heading',
          '|',
          'removeFormat',
          '|',
          'specialCharacters', 'horizontalLine', 'pageBreak',
          '|',
          'findAndReplace', 'selectAll',
          '|',
          'link', 'blockQuote', 'insertTable', 'codeBlock', 'htmlEmbed',
          '-',
          'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript',
          '|',
          'highlight', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
          '|',
          'bulletedList', 'numberedList', 'todoList',
          '|',
          'outdent', 'indent', 'alignment',
          '|',
          'insertOCImage'
        ],
        shouldNotGroupWhenFull: true
      },
      fontFamily: {
        supportAllValues: true
      },
      fontSize: {
        options: ['default', 10, 14, 16, 18, 20, 22, 24, 32, 36],
        supportAllValues: true
      },
      htmlEmbed: {
        showPreviews: true
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      link: {
        decorators: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      image: {
        styles: [
          'alignCenter',
          'alignLeft',
          'alignRight'
        ],
        resizeOptions: [
          {
            name: 'resizeImage:original',
            label: 'Original',
            value: null
          },
          {
            name: 'resizeImage:50',
            label: '50%',
            value: '50'
          },
          {
            name: 'resizeImage:75',
            label: '75%',
            value: '75'
          }
        ],
        toolbar: [
          'imageTextAlternative', 'toggleImageCaption', '|',
          'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side', '|',
          'resizeImage'
        ],
        insert: {
          integrations: [
            'insertImageViaUrl'
          ]
        }
      },
      placeholder: 'Type or paste your content here!',
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties', 'toggleTableCaption'
        ]
      },
    }}
  />
);

export default Editor;
