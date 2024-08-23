from django import forms
from ckeditor.widgets import CKEditorWidget

from comment.models import Comment


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['name', 'full_name']
        widgets = {
            'name': CKEditorWidget(),
            'full_name': CKEditorWidget(),
        }