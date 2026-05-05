import React, { useState } from 'react'
import { Button } from './Button'
import { PostCard } from './PostCard'

export interface Post {
  post_id: string
  title: string
  description: string
  category: string
  date: string
  image: string
  url?: string
  post_state_id: string
}

interface PostFormProps {
  onSubmit: (post: Post) => void
}

// Formulario para crear posts. Los labels y comentarios están en español.
export const PostForm: React.FC<PostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Noticias')
  const [date, setDate] = useState('')
  const [image, setImage] = useState('/data/news/images/news-1.jpg')
  const [postState, setPostState] = useState('publico')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPost: Post = {
      post_id: Date.now().toString(),
      title,
      description,
      category,
      date: date || new Date().toISOString().split('T')[0],
      image,
      url: '',
      post_state_id: postState,
    }
    onSubmit(newPost)
    // limpiar form
    setTitle('')
    setDescription('')
    setCategory('Noticias')
    setDate('')
    setImage('/data/news/images/news-1.jpg')
    setPostState('publico')
  }

  const previewPost: Post = {
    post_id: 'preview',
    title: title || 'Título de ejemplo',
    description: description || 'Descripción de ejemplo',
    category,
    date: date || new Date().toISOString().split('T')[0],
    image,
    url: '',
    post_state_id: postState,
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Escribe el título aquí"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Resumen o entradilla"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen (URL relativa)</label>
            <input
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="/data/news/images/news-1.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={postState}
              onChange={e => setPostState(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Crear post</Button>
          <Button type="button" variant="secondary" onClick={() => {
            setTitle('')
            setDescription('')
            setCategory('Noticias')
            setDate('')
            setImage('/data/news/images/news-1.jpg')
            setPostState('publico')
          }}>Limpiar</Button>
        </div>
      </form>

      <div>
        <h3 className="text-lg font-medium">Previsualización</h3>
        <div className="mt-3">
          <PostCard
            category={previewPost.category}
            title={previewPost.title}
            date={previewPost.date}
            image={previewPost.image}
            description={previewPost.description}
          />
        </div>
      </div>
    </div>
  )
}

export default PostForm
