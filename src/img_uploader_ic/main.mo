import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

actor {
    type Image = {
        fileName: Text;
        data: Blob;
        filetype: Text;
    };

    type Images = Trie.Trie<Principal, Image>;

    type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };

    type DeleteAssetArguments = {
        key: Text;
    };

    let AssetCanister = actor("ryjl3-tyaaa-aaaaa-aaaba-cai") : actor {
        store: ({
            key: Text;
            content_type: Text;
            content_encoding: Text;
            content: Blob;
            sha256: ?Blob;
        }) -> async ();
        delete_asset: (DeleteAssetArguments) -> async ();
    };

    stable var images : Trie.Trie<Principal, Images> = Trie.empty();

    public shared(msg) func upload (image: Image) : async Result.Result<(), Error> {

        if(isAnonymous(msg.caller)) {
            return #err(#NotAuthorized);
        };

        var filePath = "/images/";
        filePath := Text.concat(filePath, Principal.toText(msg.caller));
        filePath := Text.concat(filePath, "/");
        filePath := Text.concat(filePath, image.fileName);
        let sha256 : ?Blob = null;

        let storeResult = await AssetCanister.store({
            key = filePath;
            content_type = image.filetype;
            content_encoding = "identity";
            content = image.data;
            sha256 = sha256;
        });
        #ok(())
    };

    public shared(msg) func download () : async Result.Result<Image, Error> {

        if(isAnonymous(msg.caller)) {
            return #err(#NotAuthorized);
        };

        let result = Trie.find(
            images,
            keyPrincipal(msg.caller),
            Principal.equal
        );
        return Result.fromOption(result, #NotFound);
    };

    private func isAnonymous(caller: Principal) : Bool {
        Principal.equal(caller, Principal.fromText("2vxsx-fae"))
    };

    private func keyPrincipal(x : Principal) : Trie.Key<Principal> {
        { key = x; hash = Principal.hash(x) }
    };

    public func greet(name : Text) : async Text {
        return "Hello, " # name # "!";
    };
};
