<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'], // must exist, be text, max length 255
            'key'         => ['required', 'string', 'max:10', 'alpha_num', 'unique:projects,key'], // short code like WEB
            'description' => ['nullable', 'string'],            // optional text
            'community_id'=> ['nullable','exists:communities,id'],
        ];
    }
}
