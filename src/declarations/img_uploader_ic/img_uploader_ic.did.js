export const idlFactory = ({ IDL }) => {
  const Image = IDL.Record({
    'data' : IDL.Vec(IDL.Nat8),
    'fileName' : IDL.Text,
    'filetype' : IDL.Text,
  });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : Image, 'err' : Error });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  return IDL.Service({
    'download' : IDL.Func([], [Result_1], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'upload' : IDL.Func([Image], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
