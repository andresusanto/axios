var buildURL = require('../../../lib/helpers/buildURL');
var URLSearchParams = require('url-search-params');

describe('helpers::buildURL', function () {
  it('should support null params', function () {
    expect(buildURL('/foo')).toEqual('/foo');
  });

  it('should support RESTful URL', function () {
    expect(buildURL('/blog/:user/:userOffset', {
      user: 'boo',
      userOffset: '12'
    })).toEqual('/blog/boo/12');
  });

  it('should support RESTful URL and Query', function () {
    expect(buildURL('/blog/:user/:userOffset', {
      user: 'boo',
      userOffset: '12'
    }, {
      foo: 'bar'
    })).toEqual('/blog/boo/12?foo=bar');
  });

  it('should support params', function () {
    expect(buildURL('/foo', null, {
      foo: 'bar'
    })).toEqual('/foo?foo=bar');
  });

  it('should support object params', function () {
    expect(buildURL('/foo', null, {
      foo: {
        bar: 'baz'
      }
    })).toEqual('/foo?foo=' + encodeURI('{"bar":"baz"}'));
  });

  it('should support date params', function () {
    var date = new Date();

    expect(buildURL('/foo', null, {
      date: date
    })).toEqual('/foo?date=' + date.toISOString());
  });

  it('should support array params', function () {
    expect(buildURL('/foo', null, {
      foo: ['bar', 'baz']
    })).toEqual('/foo?foo[]=bar&foo[]=baz');
  });

  it('should support special char params', function () {
    expect(buildURL('/foo', null, {
      foo: '@:$, '
    })).toEqual('/foo?foo=@:$,+');
  });

  it('should support existing params', function () {
    expect(buildURL('/foo?foo=bar', null, {
      bar: 'baz'
    })).toEqual('/foo?foo=bar&bar=baz');
  });

  it('should support "length" parameter', function () {
    expect(buildURL('/foo', null, {
      query: 'bar',
      start: 0,
      length: 5
    })).toEqual('/foo?query=bar&start=0&length=5');
  });

  it('should use serializer if provided', function () {
    serializer = sinon.stub();
    params = {foo: 'bar'};
    serializer.returns('foo=bar');
    expect(buildURL('/foo', null, params, serializer)).toEqual('/foo?foo=bar');
    expect(serializer.calledOnce).toBe(true);
    expect(serializer.calledWith(params)).toBe(true);
  });

  it('should support URLSearchParams', function () {
    expect(buildURL('/foo', null, new URLSearchParams('bar=baz'))).toEqual('/foo?bar=baz');
  });
});
