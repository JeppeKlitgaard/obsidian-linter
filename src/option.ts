import {Setting} from 'obsidian';
import LinterPlugin from './main';
import {LinterSettings} from './rules';
import {parseTextToHTMLWithoutOuterParagraph} from './ui/helpers';

export type SearchOptionInfo = {name: string, description: string, options?: DropdownRecord[]}

/** Class representing an option of a rule */

export abstract class Option {
  public name: string;
  public description: string;
  public ruleName: string;
  public defaultValue: any;
  public searchInfo: SearchOptionInfo;

  /**
   * Create an option
   * @param {string} name - The name of the option
   * @param {string} description - The description of the option
   * @param {any} defaultValue - The default value of the option
   * @param {string?} ruleName - The name of the rule this option belongs to
   */
  constructor(name: string, description: string, defaultValue: any, ruleName?: string | null) {
    this.name = name;
    this.description = description;
    this.defaultValue = defaultValue;
    this.searchInfo = {name: name, description: description};

    if (ruleName) {
      this.ruleName = ruleName;
    }
  }

  public abstract display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void;

  protected setOption(value: any, settings: LinterSettings): void {
    settings.ruleConfigs[this.ruleName][this.name] = value;
  }
}

export class BooleanOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addToggle((toggle) => {
          toggle.setValue(settings.ruleConfigs[this.ruleName][this.name]);
          toggle.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            plugin.saveData(plugin.settings);
          });
        });

    parseTextToHTMLWithoutOuterParagraph(this.name, setting.nameEl);
    parseTextToHTMLWithoutOuterParagraph(this.description, setting.descEl);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}

export class TextOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addText((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleName][this.name]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            plugin.saveData(plugin.settings);
          });
        });

    parseTextToHTMLWithoutOuterParagraph(this.name, setting.nameEl);
    parseTextToHTMLWithoutOuterParagraph(this.description, setting.descEl);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}

export class TextAreaOption extends Option {
  public defaultValue: string;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addTextArea((textbox) => {
          textbox.setValue(settings.ruleConfigs[this.ruleName][this.name]);
          textbox.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            plugin.saveData(plugin.settings);
          });
        });

    parseTextToHTMLWithoutOuterParagraph(this.name, setting.nameEl);
    parseTextToHTMLWithoutOuterParagraph(this.description, setting.descEl);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}

export class MomentFormatOption extends Option {
  public defaultValue: boolean;

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addMomentFormat((format) => {
          format.setValue(settings.ruleConfigs[this.ruleName][this.name]);
          format.setPlaceholder('dddd, MMMM Do YYYY, h:mm:ss a');
          format.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            plugin.saveData(plugin.settings);
          });
        });

    parseTextToHTMLWithoutOuterParagraph(this.name, setting.nameEl);
    parseTextToHTMLWithoutOuterParagraph(this.description, setting.descEl);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}

export class DropdownRecord {
  public value: string;
  public description: string;

  constructor(value: string, description: string) {
    this.value = value;
    this.description = description;
  }
}

export class DropdownOption extends Option {
  public defaultValue: string;
  public options: DropdownRecord[];

  constructor(name: string, description: string, defaultValue: string, options: DropdownRecord[], ruleName?: string | null) {
    super(name, description, defaultValue, ruleName);
    this.options = options;
    this.searchInfo.options = options;
  }

  public display(containerEl: HTMLElement, settings: LinterSettings, plugin: LinterPlugin): void {
    const setting = new Setting(containerEl)
        .addDropdown((dropdown) => {
        // First, add all the available options
          for (const option of this.options) {
            dropdown.addOption(option.value, option.value);
          }

          // Set currently selected value from existing settings
          dropdown.setValue(settings.ruleConfigs[this.ruleName][this.name]);

          dropdown.onChange((value) => {
            this.setOption(value, settings);
            plugin.settings = settings;
            plugin.saveData(plugin.settings);
          });
        });

    parseTextToHTMLWithoutOuterParagraph(this.name, setting.nameEl);
    parseTextToHTMLWithoutOuterParagraph(this.description, setting.descEl);

    // remove border around every setting item
    setting.settingEl.style.border = 'none';
  }
}
