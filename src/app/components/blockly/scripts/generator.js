(function() {
  Blockly.EPL = new Blockly.Generator('EPL');

  Blockly.EPL.addReservedWords(
    // SQL Keywords
    "SELECT", "INSERT", "UPDATE", "ALL", "DISTINCT", "AS", "INTO",
    "FROM", "VALUES", "WHERE", "SET", "GOUP BY", "ORDER BY", "HAVING",
    "LIMIT", "AVG", "COUNT", "MIN", "MAX", "STDDEV", "SUM", "VARIANCE",
    "ASC", "DESC", "AS"
  );

  Blockly.EPL.finish = function(code) {
    // Clean up temporary data.
   Blockly.EPL.variableDB_.reset();

    return code.trim();
  };

  Blockly.EPL.init = function(a) {
    Blockly.EPL.definitions_=Object.create(null);
    Blockly.EPL.functionNames_=Object.create(null);
    Blockly.EPL.variableDB_ ? Blockly.EPL.variableDB_.reset() : Blockly.EPL.variableDB_ = new Blockly.Names(Blockly.EPL.RESERVED_WORDS_);
    var b=[];
    a=a.variableMap_;
    if(a.length){
      for(var c=0;c<a.length;c++)
        b[c]=Blockly.EPL.variableDB_.getName(a[c],Blockly.Variables.NAME_TYPE);
      Blockly.EPL.definitions_.variables="var "+b.join(", ")+";"};
  };
})();
