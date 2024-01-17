'use client'

import Form from "@components/Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreatePrompt = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [submitting, setSubmitting] = useState();
	const [post, setPost] = useState({
		prompt: '',
		tag: '',
	});
	const createPrompt = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const respose = await fetch('/api/prompt/new', {
				method: "POST",
				body: JSON.stringify({
					prompt: post.prompt,
					userId: session?.user.id,
					tag: post.tag,
				})
			})
			if (respose.ok) {
				router.push("/")
			}
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	}
	return (
		<Form
			type="Create"
			post={post}
			setPost={setPost}
			submitting={submitting}
			handleSubmit={createPrompt}
		/>
	)
}

export default CreatePrompt;