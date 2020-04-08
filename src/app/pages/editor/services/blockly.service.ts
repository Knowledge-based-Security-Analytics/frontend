import { Injectable } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/models/statement';
import { StatementService } from 'src/app/shared/services/statement.service';

declare var Blockly: any;

@Injectable({
  providedIn: 'root'
})
export class BlocklyService {

  public workspace: any;
  public toolboxSchema = `
  <xml id="toolbox" style="display: none">
    <category name ="EVENT SCHEMAS" custom="EVENT SCHEMAS" colour="20"></category>
  </xml>`;
  public toolboxPattern = `
  <xml id="toolbox" style="display: none">
    <category name="EVENT" custom="EVENT" colour="200"></category>
    <category name="CONDITION" custom="CONDITION" colour="100"></category>
    <category name="ACTION" custom="ACTION" colour="300"></category>
  </xml>`;
  public eventTypes: string[] = [];
  public eventAliases: string[] = [];
  public statementType = '';
  public statement: Pattern | Schema;

  constructor(private stmtService: StatementService) {
    this.stmtService.statementsObservable.subscribe( newStatements => {
      this.eventTypes = [];
      newStatements
        .filter(statement => Statement.isSchema(statement))
        .map(statement => this.eventTypes.push(statement.name));
    });
  }

  public initPreviewChangeListener(): void {
    this.workspace.addChangeListener(() => {
      if (Statement.isSchema(this.statement)) {
        this.statement.attributes = [];
      } else {
        this.statement.outputAttributes = [];
        this.statement.events = [];
        this.statement.eventSequence = [];
      }
      Blockly.EPL.workspaceToCode(this.workspace);
      // console.log(this.statementType === 'schema' ? this.currentSchema : this.currentPattern);
      /* if (document.getElementById( 'blocklyOutput' )) {
        document.getElementById( 'blocklyOutput' ).innerHTML = Blockly.EPL.workspaceToCode(this.blocklyWorkspace);
      } */
    });
  }

  public getEplStatement(): string {
    return Blockly.EPL.workspaceToCode(this.workspace);
  }

  public getBlocklyXml(): string {
    return new XMLSerializer()
    .serializeToString(Blockly.Xml.workspaceToDom(this.workspace))
    .replace(/"/g, '\'');
  }

  public async setBlocklyXml(xml: string): Promise<string> {
    return new Promise((resolve) => {
      const blocklyXML = new DOMParser().parseFromString(xml, 'text/xml').documentElement;
      setTimeout(() => {
        Blockly.Xml.appendDomToWorkspace(blocklyXML, this.workspace);
        resolve('Loaded');
      }, 1500);
    });
  }

  public clearBlocklyWorkspace(): void {
    Blockly.getMainWorkspace().clear();
  }
}
