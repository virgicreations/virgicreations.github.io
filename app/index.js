import { Renderer, Camera, Transform, Plane } from 'ogl'
import NormalizeWheel from 'normalize-wheel'

import debounce from 'lodash/debounce'

import { lerp } from 'utils/math'

import Image1 from 'images/PHOTO (1).jpg'
import Image2 from 'images/PHOTO (2).jpg'
import Image3 from 'images/PHOTO (3).jpg'
import Image4 from 'images/PHOTO (4).jpg'
import Image5 from 'images/PHOTO (5).jpg'
import Image6 from 'images/PHOTO (6).jpg'
import Image7 from 'images/PHOTO (7).jpg'
import Image8 from 'images/PHOTO (8).jpg'
import Image9 from 'images/PHOTO (9).jpg'
import Image10 from 'images/PHOTO (10).jpg'
import Image11 from 'images/PHOTO (11).jpg'
import Image12 from 'images/PHOTO (12).jpg'
import Image13 from 'images/PHOTO (13).jpg'
import Image14 from 'images/PHOTO (14).jpg'
import Image15 from 'images/PHOTO (15).jpg'
import Image16 from 'images/PHOTO (16).jpg'
import Image17 from 'images/PHOTO (17).jpg'
import Image18 from 'images/PHOTO (18).jpg'
import Image19 from 'images/PHOTO (19).jpg'
import Image20 from 'images/PHOTO (20).jpg'
import Image21 from 'images/PHOTO (21).jpg'
import Image22 from 'images/PHOTO (22).jpg'
import Image23 from 'images/PHOTO (23).jpg'
import Image24 from 'images/PHOTO (24).jpg'
import Image25 from 'images/PHOTO (25).jpg'
import Image26 from 'images/PHOTO (26).jpg'
import Image27 from 'images/PHOTO (27).jpg'

import Media from './Media'
import Background from './Background'

export default class App {
  constructor () {
    document.documentElement.classList.remove('no-js')

    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0
    }

    this.onCheckDebounce = debounce(this.onCheck, 200)

    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()

    this.createGeometry()
    this.createMedias()
    this.createBackground()

    this.update()

    this.addEventListeners()

    this.createPreloader()
  }

  createPreloader () {
    Array.from(this.mediasImages).forEach(({ image: source }) => {
      const image = new Image()

      this.loaded = 0

      image.src = source
      image.onload = _ => {
        this.loaded += 1

        if (this.loaded === this.mediasImages.length) {
          document.documentElement.classList.remove('loading')
          document.documentElement.classList.add('loaded')
        }
      }
    })
  }

  createRenderer () {
    this.renderer = new Renderer()

    this.gl = this.renderer.gl
    this.gl.clearColor(0.905, 0.909, 0.819, 1)

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene () {
    this.scene = new Transform()
  }

  createGeometry () {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }

  createMedias () {
    this.mediasImages = [
      { image: Image1, text: 'Coussin de chaise' },
      { image: Image2, text: 'Coussin de canapé' },
      { image: Image3, text: 'Mufasa le Lion' },
      { image: Image4, text: 'Sacoche ordinateur' },
      { image: Image5, text: 'Bouillotte' },
      { image: Image6, text: 'Range tricot' },
      { image: Image7, text: 'Snood de sport' },
      { image: Image8, text: 'Echarpe' },
      { image: Image9, text: 'Bonnet et snood' },
      { image: Image10, text: 'Short' },
      { image: Image11, text: 'Pull homme' },
      { image: Image12, text: 'Pull femme' },
      { image: Image13, text: 'Bandeau' },
      { image: Image14, text: 'Bonnet' },
      { image: Image15, text: 'Farandole de masques' },
      { image: Image16, text: 'Masque élastique' },
      { image: Image17, text: 'Masque lanière' },
      { image: Image18, text: 'Sacs de course' },
      { image: Image19, text: 'Journal de création' },
      { image: Image20, text: 'T-shirt homme vert' },
      { image: Image21, text: 'T-shirt homme rayé' },
      { image: Image22, text: 'Jupe longue' },
      { image: Image23, text: 'Jupe trapèze' },
      { image: Image24, text: 'Rangement ampli.' },
      { image: Image25, text: 'Lingettes' },
      { image: Image26, text: 'Etui téléphone' },
      { image: Image27, text: 'Rangement Epingles' }
    ]

    this.medias = this.mediasImages.map(({ image, text }, index) => {
      const media = new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text,
        viewport: this.viewport
      })

      return media
    })
  }

  createBackground () {
    this.background = new Background({
      gl: this.gl,
      scene: this.scene,
      viewport: this.viewport
    })
  }

  /**
   * Events.
   */
  onTouchDown (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientX : event.clientX
  }

  onTouchMove (event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const distance = (this.start - x) * 0.01

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {
    this.isDown = false

    this.onCheck()
  }

  onWheel (event) {
    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY

    this.scroll.target += speed * 0.005

    this.onCheckDebounce()
  }

  onCheck () {
    const { width } = this.medias[0]
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex

    if (this.scroll.target < 0) {
      this.scroll.target = -item
    } else {
      this.scroll.target = item
    }
  }

  /**
   * Resize.
   */
  onResize () {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }

    if (this.medias) {
      this.medias.forEach(media => media.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
    }
  }

  /**
   * Update.
   */
  update () {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'right'
    } else {
      this.direction = 'left'
    }

    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, this.direction))
    }

    if (this.background) {
      this.background.update(this.scroll, this.direction)
    }

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })

    this.scroll.last = this.scroll.current

    window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners.
   */
  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))

    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}

new App()
