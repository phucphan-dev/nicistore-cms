/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class OCFinder extends Plugin {
  init() {
    const { editor } = this;

    editor.ui.componentFactory.add('insertOCImage', (locale) => {
      const view = new ButtonView(locale);

      view.set({
        label: 'Insert image',
        icon: imageIcon,
        tooltip: true,
      });

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        window.postMessage('show-ocfinder', '*');
        window.chooseCallback = (response) => {
          editor.model.change((writer) => {
            const documentFragment = writer.createDocumentFragment();
            const imageElement = writer.createElement('imageInline', {
              src: response,
            });

            writer.insert(imageElement, documentFragment);

            editor.model.insertContent(documentFragment, editor.model.document.selection);
            window.postMessage('close-ocfinder', '*');
          });
        };
      });

      return view;
    });
  }
}
