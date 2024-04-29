void test() {
  var t = "aser";
  var l = t.codeUnits;
  for (final i in l) {
    // code point to charactoer
    print(String.fromCharCode(i));
  }
}
