<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIssueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route has 'auth'; later we'll add policies
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],    // short title
            'description' => ['nullable', 'string'],               // optional body (markdown/text)
            'status'      => ['nullable', 'in:todo,in_progress,done'], // limit to known statuses
            'priority'    => ['nullable', 'in:low,medium,high'],   // simple 3-level priority
            'due_date'    => ['nullable', 'date'],                 // optional date like 2025-10-31
            'assignee_id' => ['nullable', 'exists:users,id'],      // if provided, must be a real user id
        ];
    }
}
