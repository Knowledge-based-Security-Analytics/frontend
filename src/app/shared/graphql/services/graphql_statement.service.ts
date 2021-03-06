import { BackendStatementModel } from './../models/backendStatementModel';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { StatementDef } from '../models/statementDef';
import { GraphQLUtils } from '../models/graphql.utils';

@Injectable({
  providedIn: 'root'
})
export class GraphQLStatementService {

  constructor(private apollo: Apollo) {
  }

  public async getStatements(statementDef: StatementDef,
                             filter?: {deploymentId?: string,
                                       name?: string,
                                       deploymentMode?: string,
                                       eventType?: boolean}
                            ): Promise<BackendStatementModel[]> {
    if (!filter) {
      filter = {};
    }
    return new Promise(resolve => {
      this.apollo.query({
        query: gql`
            {
              statements(deploymentId: "${filter.deploymentId ? filter.deploymentId : ''}", name: "${filter.name ? filter.name : ''}",
                         deploymentMode: "${filter.deploymentMode ? filter.deploymentMode : ''}",
                         ${filter.eventType ? 'eventType: ' + filter.eventType : ''}){
                ${GraphQLUtils.statementDefToGql(statementDef)}
              }
            }
          `
      }).subscribe(result => {
        resolve((result.data as any).statements);
      });
    });
  }

  /**
   * @returns The ID of the deployed Statement
   */
  public async pushStatement(eplStatement: string, blocklyXml: string, objectRepresentation: string, name?: string,
                             deploymentMode?: string, eventType?: boolean, description?: string): Promise<string> {
    const gqlString = gql`
      mutation {
        deployStatement(
          data: {
            ${name ? `name: "${name}"` : ''}
            ${deploymentMode ? `deploymentMode: "${deploymentMode}"` : ''}
            ${eventType !== undefined ? `eventType: ${eventType}` : ''}
            ${description ? `description: "${description}"` : ''}
            objectRepresentation: "${objectRepresentation}"
            eplStatement: "${eplStatement}"
            blocklyXml: "${blocklyXml}"
          }
        ){deploymentId}
      }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).deployStatement.deploymentId;
  }

  /**
   * @returns The ID of the updated Statement
   */
  public async updateStatement(deploymentId: string, name?: string, deploymentMode?: string,
                               eventType?: boolean, eplStatement?: string, blocklyXml?: string,
                               description?: string, objectRepresentation?: string): Promise<string> {
    const gqlString = gql`
      mutation {
        redeployStatement(
          data: {
            ${name ? `name: "${name}"` : ''}
            ${deploymentMode ? `deploymentMode: "${deploymentMode}"` : ''}
            ${eventType !== undefined ? `eventType: ${eventType}` : ''}
            ${description ? `description: "${description}"` : ''}
            deploymentId: "${deploymentId}"
            ${objectRepresentation ? `objectRepresentation: "${objectRepresentation}"` : ''}
            ${eplStatement ? `eplStatement: "${eplStatement}"` : ''}
            ${blocklyXml ? `blocklyXml: "${blocklyXml}"` : ''}
          }
        ){deploymentId}
      }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).redeployStatement.deploymentId;
  }

  public async dropStatement(deploymentId: string): Promise<boolean> {
    const gqlString = gql`
        mutation {
          undeployStatement(
              deploymentId: "${deploymentId}"
          )
        }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).undeployStatement;
  }
}

