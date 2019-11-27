import { Statement } from 'src/app/models/statemet';
import { GraphQLStatementService } from './../shared/graphql/graphql_statement.service';
import { Injectable } from '@angular/core';
import { type } from 'os';

@Injectable({
  providedIn: 'root'
})
export class StatementService {
  private statements: Statement[];

  constructor(private graphqlStatementService: GraphQLStatementService) { }


  public async getStatements(): Promise<Statement[]> {
    return new Promise(async resolve => {
      if (!this.statements) {
        this.statements = await this.graphqlStatementService.getStatements({deploymentId: true,
                                                          deploymentDependencies: true,
                                                          deploymentMode: true,
                                                          eplStatement: true,
                                                          name: true,
                                                          blocklyXml: true,
                                                          eventType: true});
        this.statements.forEach(statement => {
          this.parseStatement(statement);
        });
      }
      console.log(this.statements);
      resolve(this.statements);
    });
  }

  /**
   * @returns The ID of the deployed Statement
   */
  public async pushStatement(eplStatement: string, blocklyXml: string, name?: string,
                             deploymentMode?: string, eventType?: boolean): Promise<string> {
    return this.graphqlStatementService.pushStatement(eplStatement, blocklyXml, name, deploymentMode, eventType).then(deploymentId => {
      this.statements.push({deploymentId, eplStatement, blocklyXml, name, deploymentMode, eventType});
      return deploymentId;
    });
  }

  /**
   * @returns The ID of the updated Statement
   */
  public async updateStatement(deploymentId: string, name?: string, deploymentMode?: string,
                               eventType?: boolean, eplStatement?: string, blocklyXml?: string): Promise<string> {
    return this.graphqlStatementService.updateStatement(deploymentId, name, deploymentMode, eventType, eplStatement, blocklyXml)
    .then(id => {
      const i = this.statements.findIndex(statement => statement.deploymentId === deploymentId);
      this.statements[i] = ({deploymentId: id, eplStatement, blocklyXml, name, deploymentMode, eventType});
      return id;
    });
  }

  public async dropStatement(deploymentId: string): Promise<boolean> {
    return this.graphqlStatementService.dropStatement(deploymentId)
    .then(success => {
      if (success) {
        const i = this.statements.findIndex(statement => statement.deploymentId === deploymentId);
        this.statements.splice(i, 1);
      }
      return success;
    });
  }

  private parseStatement(statement: Statement) {
    if (!statement.eplStatement) {
      return;
    }
    if (!statement.eplParsed) {
      statement.eplParsed = {};
    }

    if (statement.eplStatement.includes('@JsonSchema')) {
      statement.eplParsed.type = 'schema';

      statement.eplParsed.name = statement.eplStatement.match(/schema.*\(/)[0];
      statement.eplParsed.name = statement.eplParsed.name.slice(7, statement.eplParsed.name.length - 2);

      statement.eplParsed.attributes = {};
      let eventDef = statement.eplStatement.match(/schema.*\(.*\)/)[0];
      eventDef = eventDef.match(/\(.*\)/)[0];
      eventDef = eventDef.slice(1, eventDef.length - 1);
      let attributes: string[] = [];
      attributes = eventDef.split(',');
      attributes.forEach(attribute => {
        attribute = attribute.trim();
        const keyValue = attribute.split(' ');
        statement.eplParsed.attributes[keyValue[0].trim()] = keyValue[1].trim();
      });
    } else if (statement.eplStatement.includes('@KafkaOutput')) {
      statement.eplParsed.type = 'pattern';
    }
  }
}
