exports.isFounderEmail = (email) => {
    const founder = process.env.FOUNDER_EMAIL?.toLowerCase();
    const coFounder = process.env.CO_FOUNDER_EMAIL?.toLowerCase();
  
    return (
      email === founder ||
      email === coFounder
    );
  };
  