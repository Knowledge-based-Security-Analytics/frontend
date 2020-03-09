declare var Blockly: any;

export class BlocklyParser {

  constructor() { }

  public initParsers(): void {
    this.initEventTypeParser();
    this.initEventAliasParser();
    this.initPatternParser();
    this.initConditionParser();
    this.initActionParser();
  }

  private initEventTypeParser(): void {
    Blockly.EPL.type = (block: any): string => {
      let basicAttributes = `complex boolean, id int, timestamp string`;
      if (block.getFieldValue('EVENT_TYPE') === 'COMPLEX_TYPE') {
        basicAttributes = `${basicAttributes}, duration float, componentsJson string`;
      }
      return `@JsonSchema(dynamic=true) create json schema ${block.getFieldValue('TYPE_NAME')} (${basicAttributes + Blockly.EPL.statementToCode(block, 'ATTRIBUTES')})`;
    };

    Blockly.EPL.attribute_definition = (block: any): string => {
      return `, ${block.getFieldValue('ATTRIBUTE_NAME')} ${block.getFieldValue('ATTRIBUTE_TYPE')}`;
    };

    Blockly.EPL.existing_schema = (block: any): string => {
      return `${block.getFieldValue('EVENT_TYPE')}`;
    }

    Blockly.EPL.new_schema = (block: any): string => {
      return `${block.getFieldValue('EVENT_TYPE')}`;
    }
  }

  private initEventAliasParser(): void {
    Blockly.EPL.event_alias = (block: any): string => {
      return `${block.getFieldValue('ALIAS')}`;
    };
  }

  private initPatternParser(): void {
    Blockly.EPL.event_pattern = (block: any): string => {
      return `select * from pattern [${Blockly.EPL.statementToCode(block, 'EVENT_PATTERN')}]`;
    };

    Blockly.EPL.event = (block: any): string => {
      const eventAlias = block.workspace.variableMap_.variableMap_['']
        .find((variableModel: any) => variableModel.id_ === block.getFieldValue('EVENT_ALIAS')).name;
      return `${eventAlias}=${block.getFieldValue('EVENT_TYPE')}${Blockly.EPL.statementToCode(block, 'CONDITION')}${block.nextConnection.targetConnection ? ' -> ' : ''}`;
    };

    Blockly.EPL.event_pattern_repeat = (block: any): string => {
      return `[${block.getFieldValue('COUNT')}] (${Blockly.EPL.statementToCode(block, 'EVENTS')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
    };

    Blockly.EPL.event_pattern_not = (block: any): string => {
      return `NOT(${Blockly.EPL.statementToCode(block, 'EVENTS')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
    };

    Blockly.EPL.event_pattern_or = (block: any): string => {
      return `(${Blockly.EPL.statementToCode(block, 'EVENTS_1')} OR ${Blockly.EPL.statementToCode(block, 'EVENTS_2')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
    };

    Blockly.EPL.event_pattern_and = (block: any): string => {
      return `(${Blockly.EPL.statementToCode(block, 'EVENTS_1')} AND ${Blockly.EPL.statementToCode(block, 'EVENTS_2')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
    };

  }

  private initConditionParser(): void {
    Blockly.EPL.condition_wrapper = (block: any): string => {
      return `(${Blockly.EPL.statementToCode(block, 'CONDITIONS')})`;
    };

    Blockly.EPL.condition = (block: any): string => {
      return `${Blockly.EPL.statementToCode(block, 'LEFT')} ${block.getFieldValue('LOGICAL_OPERATOR')} ${Blockly.EPL.statementToCode(block, 'RIGHT')}`;
    };

    Blockly.EPL.condition_text_input = (block: any): string => {
      return `${block.getFieldValue('TEXT_INPUT')}`;
    };

    Blockly.EPL.condition_number_input = (block: any): string => {
      return `${block.getFieldValue('NUMBER_INPUT')}`;
    };
  }

  private initActionParser(): void {
    Blockly.EPL.action = (block: any): string => {
      return `(${Blockly.EPL.statementToCode(block, 'ACTIONS')})`;
    };
  }
}