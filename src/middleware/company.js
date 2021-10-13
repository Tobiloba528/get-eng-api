

const isCompany = (req, res, next) => {
    try {
        if(req.user.user_type !== "company"){
            throw new Error();
        }
        next();
      } catch (e) {
        res.status(401).send({ error: "You must be a company!" });
      }
}


module.exports = isCompany;