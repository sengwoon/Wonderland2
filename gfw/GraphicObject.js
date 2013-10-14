function GraphicObject( img )
{
  this.x    = 0;
  this.y    = 0;
  this.img    = img;
  return this;
}

GraphicObject.prototype.Render = function( context )
{
    context.drawImage( this.img, this.x, this.y );
};

GraphicObject.prototype.Translate = function( x, y )
{
    this.x += x;
    this.y += y;
};

GraphicObject.prototype.SetPosition = function( x, y )
{
    this.x = x;
    this.y = y;
};
