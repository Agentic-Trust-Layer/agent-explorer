"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listModels_1 = require("../listModels");
const setupListModelsResponse = (response = {}, isSuccessful = true) => {
    const fakeListModels = jest
        .fn()
        .mockImplementation(() => isSuccessful ? Promise.resolve(response) : Promise.reject(response));
    const IA = { listModels: fakeListModels };
    return IA;
};
describe('listModels', () => {
    test('calls OpenAPI listModels with correct request', async () => {
        const IA = setupListModelsResponse();
        await (0, listModels_1.listModels)(IA)({ type: 'embed', vectorType: 'sparse' });
        expect(IA.listModels).toHaveBeenCalledWith({
            type: 'embed',
            vectorType: 'sparse',
        });
    });
});
//# sourceMappingURL=listModels.test.js.map