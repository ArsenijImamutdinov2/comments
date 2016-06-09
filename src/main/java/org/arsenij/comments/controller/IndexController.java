package org.arsenij.comments.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by ars on 07.06.16.
 */

@Controller
public class IndexController {
    @RequestMapping("/")
    public String greeting(Model model) {
        return "index";
    }

}
