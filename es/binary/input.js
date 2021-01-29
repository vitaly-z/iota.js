"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTreasuryInput = exports.deserializeTreasuryInput = exports.serializeUTXOInput = exports.deserializeUTXOInput = exports.serializeInput = exports.deserializeInput = exports.serializeInputs = exports.deserializeInputs = exports.MAX_INPUT_COUNT = exports.MIN_INPUT_COUNT = exports.MIN_TREASURY_INPUT_LENGTH = exports.MIN_UTXO_INPUT_LENGTH = exports.MIN_INPUT_LENGTH = void 0;
// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
var ITreasuryInput_1 = require("../models/ITreasuryInput");
var IUTXOInput_1 = require("../models/IUTXOInput");
var common_1 = require("./common");
/**
 * The minimum length of an input binary representation.
 */
exports.MIN_INPUT_LENGTH = common_1.SMALL_TYPE_LENGTH;
/**
 * The minimum length of a utxo input binary representation.
 */
exports.MIN_UTXO_INPUT_LENGTH = exports.MIN_INPUT_LENGTH + common_1.TRANSACTION_ID_LENGTH + common_1.UINT16_SIZE;
/**
 * The minimum length of a treasury input binary representation.
 */
exports.MIN_TREASURY_INPUT_LENGTH = exports.MIN_INPUT_LENGTH + common_1.TRANSACTION_ID_LENGTH;
/**
 * The minimum number of inputs.
 */
exports.MIN_INPUT_COUNT = 1;
/**
 * The maximum number of inputs.
 */
exports.MAX_INPUT_COUNT = 127;
/**
 * Deserialize the inputs from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeInputs(readStream) {
    var numInputs = readStream.readUInt16("inputs.numInputs");
    var inputs = [];
    for (var i = 0; i < numInputs; i++) {
        inputs.push(deserializeInput(readStream));
    }
    return inputs;
}
exports.deserializeInputs = deserializeInputs;
/**
 * Serialize the inputs to binary.
 * @param writeStream The stream to write the data to.
 * @param objects The objects to serialize.
 */
function serializeInputs(writeStream, objects) {
    if (objects.length < exports.MIN_INPUT_COUNT) {
        throw new Error("The minimum number of inputs is " + exports.MIN_INPUT_COUNT + ", you have provided " + objects.length);
    }
    if (objects.length > exports.MAX_INPUT_COUNT) {
        throw new Error("The maximum number of inputs is " + exports.MAX_INPUT_COUNT + ", you have provided " + objects.length);
    }
    writeStream.writeUInt16("inputs.numInputs", objects.length);
    for (var i = 0; i < objects.length; i++) {
        serializeInput(writeStream, objects[i]);
    }
}
exports.serializeInputs = serializeInputs;
/**
 * Deserialize the input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeInput(readStream) {
    if (!readStream.hasRemaining(exports.MIN_INPUT_LENGTH)) {
        throw new Error("Input data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_INPUT_LENGTH);
    }
    var type = readStream.readByte("input.type", false);
    var input;
    if (type === IUTXOInput_1.UTXO_INPUT_TYPE) {
        input = deserializeUTXOInput(readStream);
    }
    else if (type === ITreasuryInput_1.TREASURY_INPUT_TYPE) {
        input = deserializeTreasuryInput(readStream);
    }
    else {
        throw new Error("Unrecognized input type " + type);
    }
    return input;
}
exports.deserializeInput = deserializeInput;
/**
 * Serialize the input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeInput(writeStream, object) {
    if (object.type === IUTXOInput_1.UTXO_INPUT_TYPE) {
        serializeUTXOInput(writeStream, object);
    }
    else if (object.type === ITreasuryInput_1.TREASURY_INPUT_TYPE) {
        serializeTreasuryInput(writeStream, object);
    }
    else {
        throw new Error("Unrecognized input type " + object.type);
    }
}
exports.serializeInput = serializeInput;
/**
 * Deserialize the utxo input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeUTXOInput(readStream) {
    if (!readStream.hasRemaining(exports.MIN_UTXO_INPUT_LENGTH)) {
        throw new Error("UTXO Input data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_UTXO_INPUT_LENGTH);
    }
    var type = readStream.readByte("utxoInput.type");
    if (type !== IUTXOInput_1.UTXO_INPUT_TYPE) {
        throw new Error("Type mismatch in utxoInput " + type);
    }
    var transactionId = readStream.readFixedHex("utxoInput.transactionId", common_1.TRANSACTION_ID_LENGTH);
    var transactionOutputIndex = readStream.readUInt16("utxoInput.transactionOutputIndex");
    return {
        type: IUTXOInput_1.UTXO_INPUT_TYPE,
        transactionId: transactionId,
        transactionOutputIndex: transactionOutputIndex
    };
}
exports.deserializeUTXOInput = deserializeUTXOInput;
/**
 * Serialize the utxo input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeUTXOInput(writeStream, object) {
    writeStream.writeByte("utxoInput.type", object.type);
    writeStream.writeFixedHex("utxoInput.transactionId", common_1.TRANSACTION_ID_LENGTH, object.transactionId);
    writeStream.writeUInt16("utxoInput.transactionOutputIndex", object.transactionOutputIndex);
}
exports.serializeUTXOInput = serializeUTXOInput;
/**
 * Deserialize the treasury input from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
function deserializeTreasuryInput(readStream) {
    if (!readStream.hasRemaining(exports.MIN_TREASURY_INPUT_LENGTH)) {
        throw new Error("Treasury Input data is " + readStream.length() + " in length which is less than the minimimum size required of " + exports.MIN_TREASURY_INPUT_LENGTH);
    }
    var type = readStream.readByte("treasuryInput.type");
    if (type !== ITreasuryInput_1.TREASURY_INPUT_TYPE) {
        throw new Error("Type mismatch in treasuryInput " + type);
    }
    var milestoneHash = readStream.readFixedHex("treasuryInput.milestoneHash", common_1.TRANSACTION_ID_LENGTH);
    return {
        type: ITreasuryInput_1.TREASURY_INPUT_TYPE,
        milestoneHash: milestoneHash
    };
}
exports.deserializeTreasuryInput = deserializeTreasuryInput;
/**
 * Serialize the treasury input to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
function serializeTreasuryInput(writeStream, object) {
    writeStream.writeByte("treasuryInput.type", object.type);
    writeStream.writeFixedHex("treasuryInput.milestoneHash", common_1.TRANSACTION_ID_LENGTH, object.milestoneHash);
}
exports.serializeTreasuryInput = serializeTreasuryInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmluYXJ5L2lucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsMkRBQStFO0FBRS9FLG1EQUFtRTtBQUduRSxtQ0FBaUY7QUFFakY7O0dBRUc7QUFDVSxRQUFBLGdCQUFnQixHQUFXLDBCQUFpQixDQUFDO0FBRTFEOztHQUVHO0FBQ1UsUUFBQSxxQkFBcUIsR0FBVyx3QkFBZ0IsR0FBRyw4QkFBcUIsR0FBRyxvQkFBVyxDQUFDO0FBRXBHOztHQUVHO0FBQ1UsUUFBQSx5QkFBeUIsR0FBVyx3QkFBZ0IsR0FBRyw4QkFBcUIsQ0FBQztBQUUxRjs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUFXLENBQUMsQ0FBQztBQUV6Qzs7R0FFRztBQUNVLFFBQUEsZUFBZSxHQUFXLEdBQUcsQ0FBQztBQUUzQzs7OztHQUlHO0FBQ0gsU0FBZ0IsaUJBQWlCLENBQUMsVUFBc0I7SUFDcEQsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTVELElBQU0sTUFBTSxHQUFvQyxFQUFFLENBQUM7SUFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBVEQsOENBU0M7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLFdBQXdCLEVBQ3BELE9BQTZCO0lBQzdCLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyx1QkFBZSxFQUFFO1FBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMscUNBQW1DLHVCQUFlLDRCQUF1QixPQUFPLENBQUMsTUFBUSxD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