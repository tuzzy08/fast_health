import { Property } from 'fabric-contract-api';

export class ParamedicNote {
	@Property()
	docType: string;

	@Property()
	noteID?: string;

	@Property()
	patientID: string;

	@Property()
	paramedicID: string;

	@Property()
	paramedicName: string;

	@Property()
	paramedicNote: string;

	@Property()
	createdAt: string;

	// @Property()
	// updatedAt: string;
}
