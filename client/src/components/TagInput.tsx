import { useCallback, useState } from 'react'
import { ReactTags, Tag } from 'react-tag-autocomplete'
import { fetchArticleMeta } from '../services/articles';
import { ArticleMeta } from "../types/Article";

function debounce(fn: (value: string) => void, delay = 100) {
  let timeoutID: number;
  return function (value: string) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => fn(value), delay)
  }
}

function mapToTags(resources: ArticleMeta[]): Tag[] {
  return resources.map(({ name, id }) => ({ value: id, label: name }));
}

function mapToResourceIds(tags: Tag[]): number[] {
  return tags.map(({ value }) => value as number);
}

export function TagInput({resourceType, onChange}: {resourceType:string, onChange: (val: number[]) => void}) {
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [selected, setSelected] = useState<Tag[]>([])
  const [suggestions, setSuggestions] = useState<Tag[]>([])

  const onAdd = useCallback(
    (newTag: Tag) => {
      const newSelecteds = [...selected, newTag];
      setSelected(newSelecteds);
      onChange && onChange(mapToResourceIds(newSelecteds));
    },
    [selected]
  )

  const onDelete = useCallback(
    (index: number) => {
      const newSelecteds = selected.filter((_, i) => i !== index);
      setSelected(newSelecteds);
      onChange && onChange(mapToResourceIds(newSelecteds));
    },
    [selected]
  )

  const onInput = useCallback(
    debounce(async (value) => {
      if (isBusy) return;

      setIsBusy(true);

      try {
        const suggestions = mapToTags(await fetchArticleMeta(resourceType, 1, value));
        setSuggestions(suggestions);
      } catch (error) {
        console.error(error);
      } finally {
        setIsBusy(false);
      }
    }),
    [isBusy]
  )

  const noOptionsText = isBusy && !suggestions.length ? 'Loading...' : 'No characters found'

  let labelText = "Select categories";
  if (resourceType === "authors") {
    labelText = "Select authors";
  } else if (resourceType === "sources") {
    labelText = "Select sources";
  }

  return (
    <>
      <ReactTags
        allowResize={false}
        labelText={labelText}
        noOptionsText={noOptionsText}
        onAdd={onAdd}
        onDelete={onDelete}
        onInput={onInput}
        placeholderText="Start typing..."
        selected={selected}
        suggestions={suggestions}
      />
    </>
  )
}