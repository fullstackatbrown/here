// package: here
// file: model/admin.proto

import * as jspb from "google-protobuf";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class GetAllSectionsReply extends jspb.Message {
  clearSectionsList(): void;
  getSectionsList(): Array<model_general_pb.Section>;
  setSectionsList(value: Array<model_general_pb.Section>): void;
  addSections(value?: model_general_pb.Section, index?: number): model_general_pb.Section;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllSectionsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllSectionsReply): GetAllSectionsReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAllSectionsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllSectionsReply;
  static deserializeBinaryFromReader(message: GetAllSectionsReply, reader: jspb.BinaryReader): GetAllSectionsReply;
}

export namespace GetAllSectionsReply {
  export type AsObject = {
    sectionsList: Array<model_general_pb.Section.AsObject>,
  }
}

