function SqlSelect(query, params)
{
  this.query = query;
  this.paramDeclaration=new Array();
  this.paramLiteral=new Array();
  if (params) {
    for(var name in params) {
      if (params.hasOwnProperty(name)) {
        this.addParameter(name, params[name]);
      }
    }
  }
}
SqlSelect.prototype.addParameter = function(name, value)
//--| name: name of the parameter
//--| value: boolean/number/string
{
  if(value===null)
  {
    this.paramDeclaration.push( lsprintf('@%s %s', name, 'char(1)') );
    this.paramLiteral.push( 'NULL' );
  }
  else
  {
    this.paramDeclaration.push( lsprintf('@%s %s', name, value.getSQLType()) );
    this.paramLiteral.push( value.toSQLLiteral() );
  }
}

SqlSelect.prototype.toString=function()
{
  var SPArgs=[this.query.toSQLLiteral(true)];
  if(this.paramDeclaration.length>0)
  {
    SPArgs.push( this.paramDeclaration.join(', ').toSQLLiteral(true) );
    SPArgs.push( this.paramLiteral.join(', ') );
  }
  return 'EXEC sp_executesql '+SPArgs.join(', ');
}

//--[ javascript type SQL extension ]-------------------------------------------

Object.prototype.getSQLType=function()
{
  throw new Error(getFunctionName(this.constructor)+'.getSQLType: not supported (prototype from Object).');
}

Number.prototype.getSQLType=function()
{
  if(parseInt(this,10)==this)
  {
    if((this&0xFF)==this) return 'tinyint';
    if((this&0xFFFF)==this) return 'smallint';
    if((this&0xFFFFFFFF)==this) return 'int';
    return 'bigint';
  }
  else
  {
    if(this>-3.40e38&&this<3.40e38) return 'float(24)';
    else return 'float(53)';
  }
}
Number.prototype.toSQLLiteral=function()
{
  return this.toString();
}

String.prototype.getSQLType=function()
{
  return 'nvarchar('+(this.length>0?this.length:1)+')';
}
String.prototype.toSQLLiteral=function()
{
  return "N'"+this.replace(/'/g,"''")+"'";
}

Boolean.prototype.getSQLType=function()
{
  return 'bit';
}
Boolean.prototype.toSQLLiteral=function()
{
  return this==true?'1':'0';
}

Date.prototype.getSQLType=function()
{
  return 'datetime';
}
Date.prototype.toSQLLiteral=function()
{
  throw new Error('Date.toSQLLiteral: Not implemented, yet');
}

//--[ Other handy functions ]---------------------------------------------------

function lsprintf(s)
//--#Light String Print Formatted; only %s is supported
{
  for(var i=1; i<arguments.length; i++)
  {
    s=s.replace('%s',arguments[i]);
  }
  return s;
}

String.prototype.multi=function(number,seperator,postFix)
//--#An extended version of VB's String function
//--@number;type=number@String multiply factor. Should be positive
//--@seperator;type=string;optional@optional seperator, handy for lists
//--@postFix;type=function;optional@
{
  var a=[],item;
  number=Math.abs(parseInt(number,10));
  if(isNaN(number)) throw new Error('String.multi: number parameter should be an number');
  while(number-->0)
  {
    item=''+this;
    if(postFix) item+=postFix();
    a.push(item);
  }
  return a.join(seperator||'');
}