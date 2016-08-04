var nodemailer = require('nodemailer');

let smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'sam.app99x@gmail.com',
		pass: process.env.MAIL_PASS
	}
};
var transporter = nodemailer.createTransport(smtpConfig);


module.exports = function(to, subject, text, html ) {
	return new Promise(function(resolve,reject){
		var mailOptions = {
			from: 'sam.app99x@gmail.com', // sender address
			to: to, // list of receivers
			subject: subject, // Subject line
			text: text, // plaintext body
			html: html // html body
		};

		return transporter.sendMail(mailOptions, function(error, info){
					if(error){
						console.log(error);
						//  {
						// 	state : false,
						// 	message : error
						// }
						return reject({state : false , message: error});
					}
						return resolve({state : true , message: info.response });
				});

	});

};