// Reject invalid identity before opening a database connection. Never link accounts by email.
export function firebaseGate({ verifyToken, findMember, dispatch, allowedOrigins = [] }) {
  return async (req, res) => {
    const reply = (status, error) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify({error})); };
    const origin = req.headers.origin;
    if(origin && !allowedOrigins.includes(origin)) return reply(403,'origin_not_allowed');
    if(origin) { res.setHeader('Access-Control-Allow-Origin',origin); res.setHeader('Vary','Origin'); }
    if(req.method==='OPTIONS') {
      res.writeHead(204,{'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Access-Control-Max-Age':'600'}); return res.end();
    }
    const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization || '');
    if(!match || match[1].length > 16384) return reply(401,'unauthorized');
    let claims;
    try { claims = await verifyToken(match[1]); } catch { return reply(401,'unauthorized'); }
    if(!claims.uid || claims.email_verified !== true) return reply(403,'email_verification_required');
    try {
      const member = await findMember(claims.uid);
      if(!member) return reply(403,'member_not_provisioned');
      // All Firebase accounts enter as members. Staff/admin claims supplied by clients are ignored.
      await dispatch(req,res,{id:String(member.id),role:'member',displayName:member.displayName,discoverable:false});
    } catch { if(!res.headersSent)reply(503,'service_unavailable'); else res.end(); }
  };
}
