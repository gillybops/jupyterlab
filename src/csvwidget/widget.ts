  // Copyright (c) Jupyter Development Team.
  // Distributed under the terms of the Modified BSD License.

  import {
    Message
  } from 'phosphor/lib/core/messaging';

  import {
    PanelLayout
  } from 'phosphor/lib/ui/panel';

  import {
    Widget
  } from 'phosphor/lib/ui/widget';

  import {
    ABCWidgetFactory, DocumentRegistry
  } from '../docregistry';

  import {
    CSVModel, CSVTable
  } from './table';

  import {
    CSVToolbar
  } from './toolbar';


  /**
   * The class name added to a csv widget.
   */
  const CSV_CLASS = 'jp-CSVWidget';

  /**
   * The class name added to a csv warning widget.
   */
  const CSV_WARNING_CLASS = 'jp-CSVWidget-warning';


  /**
   * A widget for csv tables.
   */
  export
  class CSVWidget extends Widget {
    /**
     * Construct a new csv table widget.
     */
    constructor(context: DocumentRegistry.IContext<DocumentRegistry.IModel>) {
      super();
      this._context = context;
      this.addClass(CSV_CLASS);

      this.layout = new PanelLayout();

      this._table = new CSVTable();
      this._table.model = new CSVModel({ content: context.model.toString() });

      this._toolbar = new CSVToolbar();
      this._toolbar.delimiterChanged.connect((sender, delimiter) => {
        this._table.model.delimiter = delimiter;
      });

      this._warning = new Widget();
      this._warning.addClass(CSV_WARNING_CLASS);

      let layout = this.layout as PanelLayout;
      layout.addWidget(this._toolbar);
      layout.addWidget(this._table);
      layout.addWidget(this._warning);

      context.pathChanged.connect(this.update, this);
      context.model.contentChanged.connect(() => {
        this._table.model.content = context.model.toString();
      });
    }

    /**
     * Dispose of the resources used by the widget.
     */
    dispose(): void {
      if (this.isDisposed) {
        return;
      }
      super.dispose();
      this._table.model.dispose();
      this._table.dispose();
      this._toolbar.dispose();
      this._warning.dispose();
      this._context = null;
    }

    /**
     * Handle `update-request` messages for the widget.
     */
    protected onUpdateRequest(msg: Message): void {
      this.title.label = this._context.path.split('/').pop();
    }

    /**
     * Handle `'activate-request'` messages.
     */
    protected onActivateRequest(msg: Message): void {
      this.node.focus();
    }

    private _context: DocumentRegistry.IContext<DocumentRegistry.IModel>;
    private _toolbar: CSVToolbar = null;
    private _table: CSVTable = null;
    private _warning: Widget = null;
  }


  /**
   * A widget factory for csv tables.
   */
  export
  class CSVWidgetFactory extends ABCWidgetFactory<CSVWidget, DocumentRegistry.IModel> {
    /**
     * The name of the widget to display in dialogs.
     */
    get name(): string {
      return 'Table';
    }

    /**
     * The file extensions the widget can view.
     */
    get fileExtensions(): string[] {
      return ['.csv'];
    }

    /**
     * The file extensions for which the factory should be the default.
     */
    get defaultFor(): string[] {
      return ['.csv'];
    }

    /**
     * Create a new widget given a context.
     */
    protected createNewWidget(context: DocumentRegistry.IContext<DocumentRegistry.IModel>): CSVWidget {
      return new CSVWidget(context);
    }
  }
