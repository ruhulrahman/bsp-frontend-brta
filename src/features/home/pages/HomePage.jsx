import React from 'react';
import { Button } from 'react-bootstrap';
import { toaster } from '../../../utils/helpers.js';
// import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import HeroContent from './HeroContent.jsx';

const HomePage = () => {

    const notify = () => toaster('Ok')

    // function handleClick(){
    //     this.swal.fire({
    //         title: 'Example',
    //         text: 'Swal injected',
    //         icon: 'success',
    //     });
    // }

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

    return (
        <div className="container mx-auto">
            {/* <h1 className="text-3xl font-bold text-center mb-4 text-green-500 mt-3">Welcome to BRTA Service Portal</h1> */}
            <HeroContent />

            <Button variant="success btn-sm">React Bootstrap Button</Button>
            <button className="btn btn-primary-rounded btn-sm ml-2">Tailwind Button</button>
            <button className="btn btn-secondary btn-sm ml-2">Tailwind Button</button>
            <button className="btn btn-info btn-sm ml-2">Tailwind Button</button>
            <button className="btn btn-warning btn-sm ml-2">Tailwind Button</button>
            <button className="btn btn-danger btn-sm ml-2">Tailwind Button</button>
            <span className="badge text-bg-primary ml-2">Tailwind Button</span>

            <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={notify}>Notify!</button>
            
            <div className='row'>
                <div className="col-md-4">
                    <h6 className="text-sm mb-1 font-semibold">Select your size</h6>
                    <Select options={options} />
                </div>
            </div>

            <div className="card mt-[160px]">
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
            </div>

            <div className="card mt-[160px]">
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>

                    <h1 className="text-center text-2xl font-bold">CloveUI-Buttons</h1>
                    <h1 className="text-center text-xl font-bold mt-2 opacity-50">For more components, search cloveui on github</h1>
                    <div className="flex h-40 items-center justify-center gap-5">
                        <button
                            className="inline-flex items-center gap-2 rounded bg-[#e91e63] px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-pink-500/40 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Play

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path
                                    fillRule="evenodd"
                                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <button
                            className="inline-flex items-center gap-2 rounded bg-[#e91e63] px-6 py-3 text-sm font-semibold text-white transition-all ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-pink-500/40 active:scale-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Pause
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                <path
                                    d="M15 6.75a.75.75 0 0 0-.75.75V18a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75H15ZM20.25 6.75a.75.75 0 0 0-.75.75V18c0 .414.336.75.75.75H21a.75.75 0 0 0 .75-.75V7.5a.75.75 0 0 0-.75-.75h-.75ZM5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L5.055 7.061Z"
                                />
                            </svg>
                        </button>

                        <button
                            className="group inline-flex min-w-0 items-center gap-2 rounded bg-[#e91e63] px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-pink-500/40 active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Get started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-4 w-0 transition-all group-hover:w-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        <button
                            className="group inline-flex items-center gap-2 rounded-full bg-[#e91e63] px-3 py-3 text-sm font-semibold text-white transition-all ease-in-out hover:shadow-lg hover:shadow-pink-500/40 active:scale-90 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5 transition-all group-hover:scale-125 group-hover:shadow-lg"
                            >
                                <path
                                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                                />
                            </svg>
                        </button>

                        <button
                            className="group inline-flex items-center gap-2 rounded-full bg-[#e91e63] px-3 py-3 text-sm font-semibold text-white transition-all ease-in-out hover:shadow-lg hover:shadow-pink-500/40 active:scale-90 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-5 transition-all group-hover:-translate-y-3 group-hover:translate-x-3 group-hover:scale-[2.4] group-hover:drop-shadow-lg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex h-20 items-center justify-center gap-5">
                        <button
                            className="inline-flex items-center gap-2 rounded border border-[#7629c8] px-6 py-2 text-sm font-semibold text-[#7629c8] transition-all hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Outline
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                />
                            </svg>
                        </button>

                        <button
                            className="inline-flex items-center gap-2 rounded border border-[#7629c8] px-6 py-2 text-sm font-semibold text-[#7629c8] transition-all hover:bg-[#7629c8] hover:text-white hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Outline
                        </button>

                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-[#7629c8] px-6 py-2 text-sm font-semibold text-[#7629c8] transition-all hover:bg-[#7629c8] hover:text-white hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Outline
                        </button>

                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-[#7629c8] px-6 py-2 text-sm font-semibold text-[#7629c8] transition-all hover:rotate-3 hover:scale-105 hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Outline
                        </button>

                        <button
                            className="group relative inline-flex items-center gap-2 border border-[#7629c8] px-6 py-2 text-sm font-semibold text-[#7629c8] transition-all hover:text-white hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="absolute left-0 -z-10 block h-full w-[2px] bg-[#7629c8] transition-all group-hover:w-full"></span>
                            Outline
                        </button>

                        <button
                            className="group inline-flex items-center gap-2 rounded bg-gradient-to-r from-[#9e58e9] to-blue-500 p-[2px] text-sm font-semibold transition-all hover:text-white hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="block rounded-sm bg-white px-6 py-2 group-hover:bg-transparent">Download</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
