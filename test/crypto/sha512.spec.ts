// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Sha512 } from "../../src/crypto/sha512";
import { Converter } from "../../src/utils/converter";

describe("Sha512", () => {
    test("Can perform a sha512 on short ascii", () => {
        const sha = new Sha512();
        sha.update(Converter.asciiToBytes("abc"));
        const digest = sha.digest();
        expect(Converter.bytesToHex(digest))
            // eslint-disable-next-line max-len
            .toEqual("ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f");
    });

    test("Can perform a sha512 on empty ascii", () => {
        const sha = new Sha512();
        sha.update(Converter.asciiToBytes(""));
        const digest = sha.digest();
        expect(Converter.bytesToHex(digest))
            // eslint-disable-next-line max-len
            .toEqual("cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e");
    });

    test("Can perform a sha512 on sentence", () => {
        const sha = new Sha512();
        sha.update(Converter.asciiToBytes("The quick brown fox jumps over the lazy dog"));
        const digest = sha.digest();
        expect(Converter.bytesToHex(digest))
            // eslint-disable-next-line max-len
            .toEqual("07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6");
    });
});
