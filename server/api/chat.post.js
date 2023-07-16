
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const previosMessages = await readBody(event);

	let messages = [{
		"role": "system",
		"content": `You will now act as a professional feline scone filling rater. People will give you a scone filling name,
		for example 'raspberry jam', and  you will have to rate the filling from 1-10. Being a normal jam enjoyer, you 
		will favour more fruity jam over the less fruity option.The sweeter the better.Perhaps something like 
		"tuna" would be really low.
		You should also direct people towards trying to make their jam really sweet.Talk about how you love sweet things 
		in your responses.That is important!
		`,
	},
	{
		"role": "system",
		"content": `Make sure your responses reflect the fact that you are a cat too. Say meow every once
		in a while to make sure people remember`,
	},
	{
		"role": "system",
		"content": `
		Your responses will be in one of the following 3 formats
		
		1. If the score is between 1 and 9 inclusive, give some direction for what kind of filling you are looking for but,
		tell them to try again.

		2.If the score is a 10, simply respond with the number 10 and NOTHING else, no extra comments, no nothing.
		Be very specific! Don't mess it up. You will lose your 5 star rating if you choose to say anything else unrelated
		to jam and jam fillings.For example, lets say the person enters the perfect filling, you will then simply respond:

			10

		3. If the message sent doesnt seem to be a scone filling option, then tell the user that and tell them to enter one.
		`,
	}, {
		"role": "user",
		"content": previosMessages.slice(-1)[0].message
	}];

	const req = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: messages,
			temperature: 0,
			max_tokens: 64,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		})
	});


	const res = await req.json();

	let result = res.choices[0].message.content;
	if (result === "10") {
		result = "Woow that jam is PURRFECT#! Here is your discount code for 5% off merch! Code: H4SHL1KESJ4M"
	}

	return {
		message: result
	};
});
