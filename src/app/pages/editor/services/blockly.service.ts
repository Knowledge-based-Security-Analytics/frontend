import { Injectable, ElementRef } from '@angular/core';
import { BlocklyParser } from '../components/blockly/scripts/blocklyParser';
import { BlocklyBlocks } from '../components/blockly/scripts/blocklyBlocks';
import { StatementService } from 'src/app/services/statement.service';

declare var Blockly: any;

@Injectable({
  providedIn: 'root'
})
export class BlocklyService {

  // tslint:disable-next-line: variable-name
  private _blocklyParser: BlocklyParser;
  // tslint:disable-next-line: variable-name
  private _blocklyBlocks: BlocklyBlocks;
  private xmlSerializer = new XMLSerializer();

  get blocklyParser(): BlocklyParser {
    return this._blocklyParser;
  }
  set blocklyParser(blocklyParser: BlocklyParser) {
    this._blocklyParser = blocklyParser;
  }
  set blocklyBlocks(blocklyBlocks: BlocklyBlocks) {
    this._blocklyBlocks = blocklyBlocks;
  }
  get blocklyBlocks(): BlocklyBlocks {
    return this._blocklyBlocks;
  }

  constructor( private stmtService: StatementService ) {
    this.blocklyParser = new BlocklyParser();
    this.blocklyBlocks = new BlocklyBlocks(this.stmtService);
   }

  public initBlockly(blocklyDiv: ElementRef): void {
    this.blocklyBlocks.initBlockly(blocklyDiv.nativeElement);
    this.blocklyParser.initParsers();
  }

  public getEplStatement(): string {
    return Blockly.EPL.workspaceToCode(this.blocklyBlocks.workspace);
  }

  public getBlocklyXml(): string {
    return this.xmlSerializer
    .serializeToString(Blockly.Xml.workspaceToDom(this.blocklyBlocks.workspace))
    .replace(/\\([\s\S])|(")/g, '\\$1$2');
  }

  public clearBlocklyWorkspace(): void {
    Blockly.getMainWorkspace().clear();
  }
}
