Blockly.EPL['type'] = function(block) {
  let basicAttributes = `complex boolean, id int, timestamp string`;
  if (block.getFieldValue('EVENT_TYPE') === 'COMPLEX_TYPE') { basicAttributes = `${basicAttributes}, duration float, componentsJson string`; }
  const specificAttributes = Blockly.EPL.statementToCode(block, 'ATTRIBUTES');
  return `@JsonSchema(dynamic=true) create json schema ${block.getFieldValue('TYPE_NAME')} (${basicAttributes + specificAttributes})`;
}

Blockly.EPL['attribute_definition'] = function(block) {
  return `, ${block.getFieldValue('ATTRIBUTE_NAME')} ${block.getFieldValue('ATTRIBUTE_TYPE')}`;
}

Blockly.EPL['event_pattern'] = function(block) {
  return `select * from pattern [${Blockly.EPL.statementToCode(block, 'EVENT_PATTERN')}]`;
}

Blockly.EPL['event'] = function(block) {
  return `${block.getFieldValue('EVENT_ALIAS')}=${block.getFieldValue('EVENT_TYPE')}${Blockly.EPL.statementToCode(block, 'CONDITION')}${block.nextConnection.targetConnection ? ' -> ' : ''}`;
}

Blockly.EPL['event_pattern_repeat'] = function(block) {
  return `[${block.getFieldValue('COUNT')}] (${Blockly.EPL.statementToCode(block, 'EVENTS')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
}

Blockly.EPL['event_pattern_not'] = function(block) {
  return `NOT(${Blockly.EPL.statementToCode(block, 'EVENTS')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
}

Blockly.EPL['event_pattern_or'] = function(block) {
  return `(${Blockly.EPL.statementToCode(block, 'EVENTS_1')} OR ${Blockly.EPL.statementToCode(block, 'EVENTS_2')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
}

Blockly.EPL['event_pattern_and'] = function(block) {
  return `(${Blockly.EPL.statementToCode(block, 'EVENTS_1')} AND ${Blockly.EPL.statementToCode(block, 'EVENTS_2')})${block.nextConnection.targetConnection ? ' -> ' : ''}`;
}

Blockly.EPL['condition'] = function(block) {
  return `(${Blockly.EPL.statementToCode(block, 'CONDITIONS')})`;
}

Blockly.EPL['action'] = function(block) {
  return `(${Blockly.EPL.statementToCode(block, 'ACTIONS')})`
}




















Blockly.EPL['select'] = function(block) {
  return 'SELECT' + Blockly.EPL.statementToCode(block, 'SELECT') + 'FROM' + Blockly.EPL.statementToCode(block, 'FROM');
};

Blockly.EPL['create'] = function(block) {
  if (block.getFieldValue('TYPEVALUE') === 'window') {
    return 'CREATE ' + block.getFieldValue('TYPEVALUE') + ' ' +
      block.getFieldValue('NAME') + Blockly.EPL.statementToCode(block, 'window') + ' AS ';
  } else if (block.getFieldValue('TYPEVALUE') === 'table') {
    return 'CREATE ' + block.getFieldValue('TYPEVALUE') + ' ' +
      block.getFieldValue('NAME') + ' (' + Blockly.EPL.statementToCode(block, 'data_fields') + ')';
  } else if (block.getFieldValue('TYPEVALUE') === 'eventtype') {
    return 'CREATE SCHEMA ' +
      block.getFieldValue('NAME') + ' AS (' + Blockly.EPL.statementToCode(block, 'data_fields') + ')';
  } else if (block.getFieldValue('TYPEVALUE') === 'context') {
    return 'CREATE CONTEXT ' +
      block.getFieldValue('NAME') + ' START @NOW END AFTER ' + block.getFieldValue('TIME') + ' ' + block.getFieldValue('RANGE');
  }
  };
Blockly.EPL['context'] = function(block) {
  return 'CONTEXT ' + block.getFieldValue('NAME') + ' ';
};

Blockly.EPL['attributes'] = function(block) {
  var code =  block.getFieldValue('ATTRIBUTE');
    if (block.getChildren().length === 0) {
      return code + ' ';
    } else {
      return code + ',';
    }
};

Blockly.EPL['insert_into'] = function(block) {
    return 'INSERT INTO ' + block.getFieldValue('NAME') + ' ';
};

Blockly.EPL['existing_tables'] = function(block) {
  return block.getFieldValue('TABLE');
};

Blockly.EPL['where'] = function(block) {
  return '(' + Blockly.EPL.statementToCode(block, 'ATTRIBUTES') +  ")";
};

Blockly.EPL['where_attributes'] = function(block) {
  let value = '';
  if (isNaN(block.getFieldValue('VALUE'))) {
    value = " '" + block.getFieldValue('VALUE') + "'";
  } else {
    value = " " + block.getFieldValue('VALUE');
  }
  let code = block.getFieldValue('WHEREATTR') + " " + block.getFieldValue('OPERATOR') + value;
  if (block.getChildren().length !== 0) {
    code += ' and '
  }
  return code;
};

Blockly.EPL['having'] = function(block) {
  let value = '';
  if (isNaN(block.getFieldValue('VALUE'))) {
    value = " '" + block.getFieldValue('VALUE') + "'";
  } else {
    value = " " + block.getFieldValue('VALUE');
  }
  return ' having' + Blockly.EPL.statementToCode(block, 'ATTRIBUTES') + block.getFieldValue('OPERATOR') + value;
};

Blockly.EPL['table_column'] = function(block) {
  let name = block.getFieldValue('NAME');
  let type = block.getFieldValue('COLUMNTYPE');
  let primary = block.getFieldValue('primary_key');
  let code = '';
  console.log(primary);
  if (primary === 'TRUE') {
    code += name + ' ' + type + ' primary key';
  } else {
    code += name + ' ' + type;
  }
  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['time_window'] = function(block) {
  var time = block.getFieldValue('TIME');

  return '#time(' + time + ' sec)';
};

Blockly.EPL['length_window'] = function(block) {
  var length = block.getFieldValue('LENGTH');

  return '#length(' + length + ')';
};

Blockly.EPL['output'] = function(block) {
  return ' OUTPUT ' + block.getFieldValue('WHENATTR') + ' every '
    + block.getFieldValue('OUTPUTRATE') + ' ' + block.getFieldValue('TYPE');
};

// Aggregation Functions

Blockly.EPL['average'] = function(block) {
  var code =  'AVG(' + block.getFieldValue('AVGATTR') + ')';

  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['count'] = function(block) {
  var code =  'COUNT(' + block.getFieldValue('COUNTATTR') + ')';

  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['max'] = function(block) {
  var code =  'MAX(' + block.getFieldValue('MAXATTR') + ')';

  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['min'] = function(block) {
  var code =  'MIN(' + block.getFieldValue('MINATTR') + ')';

  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['sum'] = function(block) {
  var code =  'SUM(' + block.getFieldValue('SUMATTR') + ')';

  if (block.getChildren().length === 0) {
    return code + ' ';
  } else {
    return code + ', ';
  }
};

Blockly.EPL['group_by'] = function(block) {
  return ' GROUP BY '+ block.getFieldValue('GROUPATTR');
};

Blockly.EPL['order_by'] = function(block) {
  return ' ORDER BY '+ block.getFieldValue('ORDERATTR');
};

Blockly.EPL['limit'] = function(block) {
  return ' LIMIT '+ block.getFieldValue('LIMITATTR');
};
