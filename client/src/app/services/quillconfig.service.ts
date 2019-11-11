import { Injectable } from '@angular/core';
import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;
import AutoLinks from 'quill-auto-links';
import MarkdownToolbar from 'quill-markdown-toolbar';
import MarkdownShortcuts from 'quill-markdown-shortcuts';
@Injectable({
    providedIn: 'root'
})
export class QuillConfigService {
    Inline = Quill.import('blots/inline');
    Block = Quill.import('blots/block');
    BlockEmbed = Quill.import('blots/block/embed');

    constructor() {
        // class LinkBlot extends this.Inline {
        //     static create(url) {
        //         let node = super.create();
        //         node.setAttribute('href', url);
        //         node.setAttribute('target', '_blank');
        //         return node;
        //     }
        //     static formats(node) {
        //         return node.getAttribute('href');
        //     }
        // }
        // LinkBlot.blotName = 'link';
        // LinkBlot.tagName = 'a';
        // class ImageBlot extends this.BlockEmbed {
        //     static create(value) {
        //         let node = super.create();
        //         node.setAttribute('alt', value.alt);
        //         node.setAttribute('src', value.url);
        //         return node;
        //     }

        //     static value(node) {
        //         return {
        //             alt: node.getAttribute('alt'),
        //             url: node.getAttribute('src')
        //         };
        //     }
        // }
        // ImageBlot.blotName = 'image';
        // ImageBlot.tagName = 'img';
        // Quill.register(ImageBlot);
        // Quill.addContainer(("#tooltip-controls"));
    }

    registerQuillAdditionalOptions() {
        Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
        Quill.register('modules/autoLinks', AutoLinks);
    }

    getGeneralWysiwygConfig() {
        return {
            debug: 'error',
            theme: 'bubble',
            placeholder: 'Insert Content...',
            modules: {
                autoLinks: true,
                markdownShortcuts: {},
                toolbar: {
                    container: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ 'header': 1 }, { 'header': 2 }],
                        ['blockquote', 'code-block'],
                        ['image', 'video'],
                        ['markdown']
                    ],
                },
            },
            formats: [
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'link',
                'header',
                'code-block',
                'image',
                'video'
                // 'mention',
            ],

        };
    }
    getGeneralViewConfig() {
        return {
            debug: 'error',
            theme: 'bubble',
            enable: false,
            modules: {
                autoLinks: true,
                markdownShortcuts: {},
            
                // mention: {
                //     // mention configuration
                // },
            },
            formats: [
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'link',
                'header',
                'code-block',
                'image',
                'video'
                // 'mention',
            ],
        };
    }

    getMediumConfig() {
        return {
            debug: 'error',
            theme: 'snow',

            enable: true,
            modules: {
                autoLinks: true,
                markdownShortcuts: {},
                toolbar: '#medium-toolbar',
                // mention: {
                //     // mention configuration
                // },
            },
            formats: [
                'bold',
                'italic',
                'underline',
                'strike',
                'list',
                'link',
                'header',
                'code-block',
                'image',
                'video'
                // 'mention',
            ],
        };
    }
}