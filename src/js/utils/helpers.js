export const latinize = function(filename) {
  var translate_re = /[ü]/g;
  var translate = {
    ü: 'u'
  };

  return filename.replace(translate_re, function(match) {
    return translate[match];
  });
};
