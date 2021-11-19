const baseURL = "http://localhost:8080"

const encode = encodeURIComponent;

export interface Vendor {
	ID: string;
	BusinessAddress: string;
	Name: string;
	Phone: string;
}

export async function vendor(id: string): Promise<Vendor> {
	const options: RequestInit = {
		method: "GET",
	};
	const resp = await fetch(baseURL + `/vendors/${encode(id)}`, options);
	if (resp.status < 200 || resp.status >= 300) {
		throw resp;
	}

	return resp.json();
}
